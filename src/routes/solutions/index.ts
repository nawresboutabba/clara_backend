"use strict";
import * as express from "express";
const router = express.Router();
import authentication from "../../middlewares/authentication";
import * as _ from 'lodash';
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { validationResult, body } from "express-validator";
import SolutionController from '../../controller/solution/index'
import { ERRORS, PARTICIPATION_MODE, RESOURCE, RULES, SOLUTION_STATUS, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import AreaService from "../../services/Area.service";
import TeamService from "../../services/Team.service";
import { isCompositionUsersValid } from "../../utils/configuration-rules/participation";
import UserService from "../../services/User.service";
import ConfigurationService from "../../services/Configuration.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import { acl } from "../../middlewares/acl";

router.post("/solution/default-configuration", [
  authentication,
  acl(RULES.IS_LEADER),
  body("can_show_disagreement").isBoolean(),
  body("disagreement_default").isBoolean(),
  body("can_fix_desapproved_idea").isBoolean(),
  body("can_choose_scope").isBoolean(),
  body("is_private_default").isBoolean(),
  body("can_choose_WSALevel").isBoolean(),
  body("WSALevel_available", "WSALevel_available invalid").custom(async (value: string[]): Promise<void> => {
    const WSALevel: string[] = _.sortedUniq(value)
    WSALevel.forEach(value => {
      if (![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)) {
        return Promise.reject("WSALevel_available invalid")
      }
    })
    return Promise.resolve()
  }),
  body("WSALevel_default").isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
  body("community_can_see_reactions").isBoolean(),
  body("maximun_dont_understand").isInt({ min: 0 }),
  body("minimun_likes").isInt({ min: 0 }),
  body("reaction_filter").notEmpty().isBoolean(),
  body("external_contribution_available_for_generators").isBoolean(),
  body("external_contribution_available_for_committee").isBoolean(),
  body("participation_mode_available", 'participation_mode_available invalid').custom(async (value: string[]): Promise<void> => {
    const participationModeAvailable: string[] = _.sortedUniq(value)
    participationModeAvailable.forEach(value => {
      if (![PARTICIPATION_MODE.TEAM, PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP].includes(value)) {
        return Promise.reject("participation_mode_available invalid")
      }
    })
    return Promise.resolve()
  }),
  body("time_in_park").isInt(),
  body("time_expert_feedback").isInt(),
  body("time_idea_fix").isInt(),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const solutionController = new SolutionController()
    const solutionConfiguration = await solutionController.setSolutionDefaultConfiguration(req.body)
    res
      .json(solutionConfiguration)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post(
  "/solution",
  [
    authentication,
    /**
     * Check that default configuration is set
     */
    body("default_solution_configuration").custom(async (value, { req }): Promise<void> => {
      try {
        const defaultSolutionConfiguration = await ConfigurationService.getConfigurationDefault(RESOURCE.SOLUTION)
        if (!defaultSolutionConfiguration) {
          return Promise.reject(ERRORS.ROUTING.DEFAULT_CONFIGURATION_NOT_FOUND)
        }
        req.utils = { defaultSolutionConfiguration, ...req.utils }
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }),
    /**
     * Challenge situation description
     */
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
    body("images", "images does not valid").isArray(),

    body("department_affected").isArray(),
    /**
     * Check that department affected is valid
     */
    body("department_affected").custom(async (value: string[], { req }): Promise<void> => {
      try {
        const departmentAffected = await AreaService.getAreasById(value)
        if (departmentAffected.length == value.length) {
          req.utils = { departmentAffected, ...req.utils }
          return Promise.resolve()
        }
        return Promise.reject("department_affected does not valid")
      } catch (error) {
        return Promise.reject("department_affected does not valid")
      }
    }),

    body("is_privated", VALIDATIONS_MESSAGE_ERROR.SOLUTION.IS_PRIVATE_INVALID).notEmpty().escape().isIn([true, false]),
    body("WSALevel_chosed","WSALevel_chosed can not be empty").notEmpty().isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
    body("WSALevel_chosed").custom(async (value: string, { req }): Promise<void> => {
      try {
        /**
         * Check that user can choose WSALevel, otherwise ignore decision. 
         */
        if (req.utils.defaultSolutionConfiguration.canChooseWSALevel) {
          /**
           * If user can choose WSALevel, check that WSALevel is valid.
           */
          if (!req.utils.defaultSolutionConfiguration.WSALevel_available.includes(value)) {
            return Promise.reject(ERRORS.ROUTING.WSALEVEL_NOT_AVAILABLE)
          }
          /**
           * Check that if WSALevel == AREA, user inserted areasId valid.
           */
          if (value == WSALEVEL.AREA) {
            const areasAvailable = await AreaService.getAreasById(req.body.areas_available)
            if (areasAvailable.length != req.body.areas_available.length) {
              return Promise.reject("Areas available does not valid")
            }
            req.utils = { areasAvailable, ...req.utils }
          }
          return Promise.resolve()
        }
        /**
         * Ignore decision because user can not choose WSALevel. Taking default configuration. 
         */
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }),
    /**
     * Solution description
     */
    body("proposed_solution", "proposed_solution can not be empty").notEmpty().escape(),

    /**
     * participation.mode_chosed is like participation_mode_chosed
     */
    body("participation.chosed_mode", "participation.mode_chosed invalid").custom(async (value: string, { req }): Promise<void> => {
      try {
        /**
         * Check that participation chosed by user is available
         */
        if (req.utils.defaultSolutionConfiguration.participationModeAvailable.includes(value)) {
          return Promise.resolve()
        }
        return Promise.reject("participation.chosed_mode invalid")
      } catch (error) {
        return Promise.reject(error)
      }
    }),
    body("participation.chosed_mode").custom(async (value: string, { req }): Promise<void> => {
      try {
        const creator = await UserService.getUserActiveByUserId(req.body.participation.creator)
        const guests = await UserService.getUsersById(req.body.participation.guests)
        /**
         * if any of the members who are going to participate does not exist.
         */
        if (!guests.length == req.body.participation.guests.length || !creator) {
          return Promise.reject("participation integrants is not valid")
        }
        /**
         * Check that external users composition. 
         */
        const validComposition = await isCompositionUsersValid(creator, guests, req.utils.defaultSolutionConfiguration)
        /**
         * Check team name is valid.
         */
        if (value == PARTICIPATION_MODE.TEAM && !req.body.participation.team_name) {
          return Promise.reject("participation.team_name is required")
        }
        /**
         * Check that team_name does not exist
         */
        if (value == PARTICIPATION_MODE.TEAM && req.body.participation.team_name) {
          const team = await TeamService.getTeamByName(req.body.participation.team_name)
          if (team) {
            return Promise.reject("team_with this name already exist")
          }
        }
        /**
         * Check if all users are allowed
         */
        if (validComposition) {
          req.utils = { creator, guests, ...req.utils }
          return Promise.resolve()
        }
        return Promise.reject("invalid composition. Invitations to externals users not availible for this user")
      } catch (error) {
        return Promise.reject("participation.chosed_mode invalid")
      }
    }),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_SOLUTION)

      const solutionController = new SolutionController()
      const solution = await solutionController.newSolution(req.body, req.user, req.utils)
      res
        .status(200)
        .json(solution)
        .send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/solution",
  [
    authentication
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const solutionController = new SolutionController()
      const query: QuerySolutionForm = await formatSolutionQuery(req.query)
      const solutions = await solutionController.listSolutions(query)
      res
        .json(solutions)
        .status(200)
        .send();
      next();
    } catch (e) {
      next(e);
    }
  }
);


router.get(
  "/solution/:solutionId",
  [
    authentication,
    acl(RULES.CAN_VIEW_SOLUTION)
  ]
  ,
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const solutionController = new SolutionController()
      const solution = await solutionController.getSolution(req.params.solutionId, req.resources.solution)
      res.status(200).json(solution).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);


router.patch(
  "/solution/:solutionId", [
    authentication,
    acl(RULES.CAN_EDIT_SOLUTION),
    body("default_solution_configuration").custom(async (value, { req }): Promise<void> => {
      try {
        const defaultSolutionConfiguration = await ConfigurationService.getConfigurationDefault(RESOURCE.SOLUTION)
        if (!defaultSolutionConfiguration) {
          return Promise.reject(ERRORS.ROUTING.DEFAULT_CONFIGURATION_NOT_FOUND)
        }
        req.utils = { defaultSolutionConfiguration, ...req.utils }
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }),
    /**
     * Status have to be changed trought particular endpoint.
     */
    body("status", "status invalid").notEmpty()
      .isIn([SOLUTION_STATUS.DRAFT, SOLUTION_STATUS.PROPOSED, SOLUTION_STATUS.APROVED_FOR_DISCUSSION])
      .custom(async (value, { req }): Promise<void> => {
        if (req.resources.solution.status == value) {
          return Promise.resolve()
        }
        return Promise.reject("CAN_NOT_EDIT_SOLUTION")
      }),
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
    body("images", "images does not valid").isArray(),
    body("department_affected").isArray(),
    body("department_affected").custom(async (value: string[], { req }): Promise<void> => {
      try {
        const departmentAffected = await AreaService.getAreasById(value)
        if (departmentAffected.length == value.length) {
          req.utils = { departmentAffected, ...req.utils }
          return Promise.resolve()
        }
        return Promise.reject("department_affected does not valid")
      } catch (error) {
        return Promise.reject("department_affected does not valid")
      }

    }),
    body("is_privated", VALIDATIONS_MESSAGE_ERROR.SOLUTION.IS_PRIVATE_INVALID).isBoolean(),
    body("WSALevel_chosed").custom((value: string, { req }): Promise<void> => {
      try {
        /**
       * Check that user can choose WSALevel, otherwise ignore decision. 
       */
        if (req.utils.defaultSolutionConfiguration.canChooseWSALevel) {
          /**
         * If user can choose WSALevel, check that WSALevel is valid.
         */
          if (!req.utils.defaultSolutionConfiguration.WSALevel_available.includes(value)) {
            return Promise.reject(ERRORS.ROUTING.WSALEVEL_NOT_AVAILABLE)
          }
          return Promise.resolve()
        }
        /**
       * Ignore decision because user can not choose WSALevel. Taking default configuration. 
       */
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.PATCH_SOLUTION)

      const solutionController = new SolutionController()
      //const solution = await solutionController.updateSolutionPartially(req.params.solutionId, req.body, req.resources, req.user, req.utils)
      res
        .status(200)
        .json()
        .send();
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/solution/:solutionId",
  /**
   * @TODO Check that the user can delete the solution
   */
  [
    authentication,
    acl(RULES.IS_SOLUTION_CREATOR),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const solutionController = new SolutionController()
      await solutionController.deleteSolution(req.params.solutionId, req.user)

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);
const solutionsRouter = router
export default solutionsRouter;
