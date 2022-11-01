"use strict";
import * as express from "express";
import { NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import {
  ERRORS,
  EVALUATION_NOTE_ROLE,
  PARTICIPATION_MODE,
  RULES,
  URLS,
  VALIDATIONS_MESSAGE_ERROR,
  WSALEVEL,
} from "../../constants";
import SolutionController from "../../controller/solutions/index";
import { acl } from "../../middlewares/acl";
import authentication from "../../middlewares/authentication";
import {
  RequestMiddleware,
  ResponseMiddleware,
} from "../../middlewares/middlewares.interface";
import { SOLUTION_STATUS } from "./solution.model";
import AreaService from "../../services/Area.service";
import BaremoService from "../../services/Baremo.service";
import ChallengeService from "../../services/Challenge.service";
import TeamService from "../../services/Team.service";
import { checkBaremaTypeSuggested } from "../../utils/sanitization/baremaTypeSuggested.check";
import { checkDifferential } from "../../utils/sanitization/differential.check";
import { checkFirstDifficulty } from "../../utils/sanitization/firstDifficulty.check";
import { checkImplementationTimeInMonths } from "../../utils/sanitization/implementationTimeInMonth.check";
import { checkIsNewFor } from "../../utils/sanitization/isNewFor.check";
import { checkMoneyNeeded } from "../../utils/sanitization/moneyNeeded.check";
import { checkProposedSolution } from "../../utils/sanitization/proposedSolution.check";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import { checkSecondDifficulty } from "../../utils/sanitization/secondDifficulty.check";
import { tagsBodyCheck } from "../../utils/sanitization/tagsValidArray.check";
import { checkTestDescription } from "../../utils/sanitization/testDescription.check";
import { checkThirdDifficulty } from "../../utils/sanitization/thirdDifficulty.check";
import { checkWasTested } from "../../utils/sanitization/wasTested.check";
import BaremoStateMachine from "../../utils/state-machine/state-machine.baremo";
import SolutionStateMachine from "../../utils/state-machine/state-machine.solution";
const router = express.Router();

router.post(
  URLS.SOLUTION.SOLUTION,
  [
    authentication,
    /**
     * This item that not exist in request. "generic_challenge_exist" is validation wich the
     * goal is check that generic challenge was created, Remember that ideas free are associated
     * to GENERIC CHALLENGE
     */
    body("generic_challenge_exist").custom(
      async (value: any, { req }): Promise<void> => {
        try {
          const challenge = await ChallengeService.getGenericChallenge();
          if (challenge) {
            req.resources = { challenge, ...req.resource };
            return Promise.resolve();
          }
          return Promise.reject();
        } catch (error) {
          return Promise.reject();
        }
      }
    ),
  ],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      await throwSanitizatorErrors(
        validationResult,
        req,
        ERRORS.ROUTING.ADD_SOLUTION
      );

      const solutionController = new SolutionController();
      const solution = await solutionController.newSolution(
        req.user,
        req.utils,
        req.resources.challenge
      );
      res.status(200).json(solution).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/solution/:solutionId",
  /**
   * @TODO Check that the user can delete the solution
   */
  [authentication, acl(RULES.IS_SOLUTION_CREATOR)],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      const solutionController = new SolutionController();
      await solutionController.deleteSolution(req.params.solutionId, req.user);

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

/**
 * This endpoint initialize a baremo. If this is a first baremo open, then
 * idea status have to change to : READY_FOR_ANALYSIS --> ANALYZING
 * https://www.notion.so/Implement-analysis-step-endpoints-Part-II-678f92e5a4434cfc9564d2903a46fabb
 */
router.post(
  [URLS.SOLUTION.SOLUTION_SOLUTIONID_BAREMO_GROUPVALIDATOR],
  [
    authentication,
    acl(RULES.IS_VALIDATOR_OF_SOLUTION),
    /**
     * Check that this user don't have another baremo open for this solution.
     * If exist a baremo with this USER-SOLUTION then the operation have to be GET or PATCH
     */
    param("solutionId").custom(async (value, { req }) => {
      try {
        const baremo = await BaremoService.getCurrentBaremoByUserAndSolution(
          req.resources.solution,
          req.user
        );
        if (baremo) {
          return Promise.reject(
            "this user has a baremo open for this solution"
          );
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject("this user has a baremo open for this solution");
      }
    }),
    /**
     * Check if solution is available for analysis
     */
    param("solutionId").custom(async (value, { req }) => {
      try {
        const status = req.resources.solution.status;
        const valid = [
          SOLUTION_STATUS.ANALYZING,
          SOLUTION_STATUS.READY_FOR_ANALYSIS,
        ];
        if (!valid.includes(status)) {
          return Promise.reject(
            "anaysis not available for this solution status"
          );
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }),
  ],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      await throwSanitizatorErrors(
        validationResult,
        req,
        ERRORS.ROUTING.NEW_BAREMO
      );

      const solutionController = new SolutionController();
      const baremo = await solutionController.newBaremo(
        req.params.solutionId,
        req.resources.solution,
        req.user,
        req.utils
      );

      res.json(baremo).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  [
    URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID,
    URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_FINISH,
    URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_REOPEN,
  ],
  [
    authentication,
    acl(RULES.IS_BAREMO_CREATOR),
    body("comment").notEmpty(),
    /**
     * Artificial attribute. Does not exist. Is used just for create the check operation
     */
    body("transition").custom(async (value, { req }) => {
      try {
        if (
          req.url ==
          URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_FINISH.replace(
            ":baremoId",
            req.params.baremoId
          )
        ) {
          const status = BaremoStateMachine.dispatch(
            req.utils.baremo.status,
            "confirm"
          );
          req.body = { ...req.body, status };
        } else if (
          req.url ==
          URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_REOPEN.replace(
            ":baremoId",
            req.params.baremoId
          )
        ) {
          const status = BaremoStateMachine.dispatch(
            req.utils.baremo.status,
            "reopen"
          );
          req.body = { ...req.body, status };
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }),
    /**
     * Add SOLUTION.STATUS = 'ANALYZING' condition
     */
  ],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      await throwSanitizatorErrors(
        validationResult,
        req,
        ERRORS.ROUTING.NEW_BAREMO
      );
      const solutionController = new SolutionController();
      const baremo = await solutionController.editBaremo(
        req.params.baremoId,
        req.body,
        req.utils.baremo
      );
      res.json(baremo).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get current Baremo for an user for solution. User is obtained from session
 */
router.get(
  URLS.SOLUTION.SOLUTION_SOLUTIONID_BAREMO_GROUPVALIDATOR_CURRENT,
  [authentication, acl(RULES.IS_VALIDATOR_OF_SOLUTION)],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      const solutionController = new SolutionController();
      const baremo = await solutionController.getCurrent(
        req.params.solutionId,
        req.resources.solution,
        req.user
      );
      res.json(baremo).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/solution/:solutionId/evaluation-note",
  [
    authentication,
    /**
     * Check that validator can do this action
     */
    acl(RULES.IS_VALIDATOR_OF_SOLUTION),
    body("title", "title can not be empty").notEmpty(),
    body("description", "description can not be empty").notEmpty(),
    body("type", "type is not valid").isIn([
      EVALUATION_NOTE_ROLE.GROUP_VALIDATOR,
    ]),
  ],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      const solutionController = new SolutionController();
      const note = await solutionController.evaluationNote(
        req.params.solutionId,
        req.body,
        req.resources.solution,
        req.user
      );
      res.json(note).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

const solutionsRouter = router;
export default solutionsRouter;
