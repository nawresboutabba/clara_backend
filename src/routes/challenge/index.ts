const router = require("express").Router();
const Challenge = require("@models/challenges");
const Solution = require("@models/solutions");
const _ = require("lodash");
const { nanoid } = require("nanoid");
import authentication from "../../middlewares/authentication";
import { NextFunction } from 'express';
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
import ChallengeService from '../../services/Challenge.service';
import SolutionService from '../../services/Solution.service';
const { validationResult, body } = require("express-validator");
const {
  SOLUTION,
  SOLUTION_STATUS,
  HTTP_RESPONSE,
} = require("@root/src/constants");

router.post(
  "/challenge",
  [
    body("description", "description can not be empty").notEmpty(),
/*     authentication, */
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const created = new Date();
      const {
        description,
        images,
        time_period: timePeriod,
        validators,
        referrer,
        work_space_available: workSpaceAvailable,
      } = req.body;
      const challenge = await ChallengeService.newChallenge({
        challengeId: nanoid(),
        created,
        description,
        status: "LAUNCHED",
        images,
        active: true, 
        timePeriod,
        validators,
        referrer,
        workSpaceAvailable,
      });
      res.status(200).json(challenge).send();
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/challenge/:challengeId/solution",
  [
    checkResourceExistFromParams(`challenges`),
    body("description", "description can not be empty").notEmpty(),
/*     authentication, */
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const created = new Date();
      const challengeId = req.resources.challenge.challengeId;
      const {
        description,
        file_name: fileName,
        images,
        is_private: isPrivate,
      } = req.body;
      const solution = await SolutionService.newSolution({
        // @TODO automatic Id
        challengeId: challengeId,
        solutionId: nanoid(),
        // calculated trough session
        authorEmail: req.user.email,
        created: created,
        updated: created,
        canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
        status: SOLUTION_STATUS.LAUNCHED,
        timeInPark: SOLUTION.TIME_IN_PARK,
        description,
        isPrivate:false,
        active: true,
        fileName: "URL1",
        images: ["URL1","URL2"],
      });
      res.status(200).json(solution).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  `/challenge/:challengeId`,
  [checkResourceExistFromParams(`challenges`), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      res.status(200).json(req.resources.challenge).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/challenge/:challengeId",
  [checkResourceExistFromParams("challenges"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeChanges = _.mapKeys(req.body, (v: any, k:any) => _.camelCase(k));
      const challengeId = req.params.challengeId;

      const resp = await ChallengeService.updateWithLog(challengeId, challengeChanges);
      
      res.status(200).json(resp).send();
      next();
    } catch (error) {
      res.status(500);
      next(error);
    }
  }
);

router.delete(
  "/challenge/:challengeId",
  [checkResourceExistFromParams("challenges"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeId = req.params.challengeId;
      await ChallengeService.deactivateChallenge(challengeId);

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

const challengeRouter = router
export default challengeRouter;
