import * as express from "express";
const router = express.Router();
import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import { NextFunction } from 'express';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
const { validationResult, body, check } = require("express-validator");
import ChallengeController from '../../controller/challenge'
import { ERRORS, PARTICIPATION_MODE, RESOURCE, RULES, URLS, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import { formatChallengeQuery, QueryChallengeForm } from "../../utils/params-query/challenge.query.params";
import AreaService from "../../services/Area.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import GroupValidatorService from "../../services/GroupValidator.service";
import * as _ from 'lodash';
import toISOData, { getCurrentDate } from "../../utils/date";
import { isCompositionUsersValid } from "../../utils/configuration-rules/participation";
import UserService from "../../services/User.service";
import TeamService from "../../services/Team.service";
import ConfigurationService from "../../services/Configuration.service";
import { GroupValidatorI } from "../../models/group-validator";
import { AreaI } from "../../models/organization.area";

router.get("/challenge/default-configuration", [
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()
    const challengeConfiguration = await challengeController.getChallengeDefaultConfiguration()
    res
      .json(challengeConfiguration)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post("/challenge/default-configuration", [
  authentication,
  acl(RULES.IS_LEADER),
  check("", 'challenge configuration already exist').custom(async (): Promise<void> => {
    const currentConfiguration = await ConfigurationService.getConfigurationDefault(RESOURCE.CHALLENGE)
    if (currentConfiguration) {
      return Promise.reject()
    }
    return Promise.resolve()
  }),
  body("can_show_disagreement").isBoolean(),
  body("disagreement_default").isBoolean(),
  body("can_fix_desapproved_idea").isBoolean(),
  body("can_choose_scope").isBoolean(),
  body("is_private_default").isBoolean(),
  body("can_choose_WSALevel").isBoolean(),
  check("WSALevel_available", "WSALevel_available invalid").custom(async (value: string[]): Promise<void> => {
    const WSALevel: string[] = _.sortedUniq(value)
    WSALevel.forEach(value => {
      if (![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)) {
        return Promise.reject()
      }
    })
    return Promise.resolve()
  }),
  body("WSALevel_default").isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
  body("community_can_see_reactions").isBoolean(),
  body("maximun_dont_understand").isInt({ min: 0 }),
  body("minimun_likes").isInt({ min: 0 }),
  body("reaction_filter").isBoolean(),
  body("external_contribution_available_for_generators").isBoolean(),
  body("external_contribution_available_for_committee").isBoolean(),
  body("participation_mode_available", 'participation_mode_available invalid').custom(async (value: string[]): Promise<void> => {
    const participationModeAvailable: string[] = _.sortedUniq(value)
    participationModeAvailable.forEach(value => {
      if (![PARTICIPATION_MODE.TEAM, PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP].includes(value)) {
        return Promise.reject()
      }
    })
    return Promise.resolve()
  }),
  body("time_in_park").isInt(),
  body("time_expert_feedback").isInt(),
  body("time_idea_fix").isInt(),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.CHALLENGE_CONFIGURATION)

    const challengeController = new ChallengeController()
    const challengeConfiguration = await challengeController.setChallengeDefaultConfiguration(req.body)
    res
      .json(challengeConfiguration)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})
router.get(URLS.CHALLENGE.CHALLENGE_PROPOSE, [
  authentication,
  acl(RULES.IS_COMMITTE_MEMBER)
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {

    const query: QueryChallengeForm = await formatChallengeQuery(req.query)
    const challengeController = new ChallengeController()
    const challenge = await challengeController.listChallengeProposal(query)
    res
      .json(challenge)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})
router.get(URLS.CHALLENGE.CHALLENGE_PROPOSE_PROPOSEID, [
  authentication,
  acl(RULES.IS_COMMITTE_MEMBER)
], (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()
    const proposal = challengeController.getChallengeProposal(req.params.proposeId)
    res
      .json(proposal)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post(
  [
    URLS.CHALLENGE.CHALLENGE,
    URLS.CHALLENGE.CHALLENGE_PROPOSE,
  ],
  [
    authentication,
    acl(
      RULES.CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL
    ),
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
    body("images", "images does not valid").isArray(),
    body("department_affected").isArray(),
    body("department_affected").custom(async (value: string[], { req }): Promise<void> => {
      try {
        const departmentAffected = await AreaService.getAreasById(value)
        if (departmentAffected.length == value.length) {
          req.utils = departmentAffected
          return Promise.resolve()
        }
        return Promise.reject("department_affected does not valid")
      } catch (error) {
        return Promise.reject("department_affected does not valid")
      }
    }),
    check("group_validator", "group_validator invalid").custom((value: string, { req }): Promise<void> => {
      return new Promise((resolve, reject) => {
        GroupValidatorService
          .getGroupValidatorById(req.body.group_validator)
          .then((groupValidator: GroupValidatorI) => {
            if (groupValidator) {
              req.utils = groupValidator
              return resolve()
            }
          })
          .catch(error => {
            return reject(error)
          })
      })
    }),
    body("is_strategic", "is_strategic invalid").notEmpty().escape().isIn([true, false]),
    body("finalization", "finalization invalid").notEmpty(),
    body("finalization").custom((value: Date): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (toISOData(value) > getCurrentDate()) {
          return resolve()
        }
        return reject("Date does not valid. Finalization must be greater than current date")
      })
    }),
    /**
     * Checking the configuration of allowed solutions.
     */
    body("can_show_disagreement", "can_show_disagreement invalid").notEmpty().escape().isIn([true, false]),
    body("can_fix_disapproved_idea", "can_fix_disapproved_idea invalid").notEmpty().escape().isIn([true, false]),

    body("can_choose_scope", "can_choose_scope invalid").notEmpty().escape().isIn([true, false]),
    body("is_privated", "is_privated invalid").notEmpty().escape().isIn([true, false]),

    body("can_choose_WSALevel", "can_choose_WSALevel invalid").notEmpty().escape().isIn([true, false]),
    body("WSALevel_available", "WSALevel_available invalid").custom((value: string[], { req }): Promise<void> => {
      return new Promise((resolve, reject) => {
        const WSALevel: string[] = _.sortedUniq(value)
        WSALevel.forEach(value => {
          if (![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)) {
            return reject("WSALevel_available invalid")
          }
        })
        return resolve()
      })
    }),
    body("WSALevel_chosed", "WSALevel_chosed invalid").isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),

    body("areas_available", "areas_available invalid").custom(async (value: string[], { req }): Promise<void> => {
      if (req.body.WSALevel_chosed == WSALEVEL.AREA) {
        const areasAvailable = await AreaService.getAreasById(_.sortedUniq(value))

        if (areasAvailable.length > 0) {
          req.utils = areasAvailable
          return Promise.resolve()
        } else {
          return Promise.reject("areas_available can not be empty when WSALevel_chosed = AREA")
        }
      }
      return Promise.resolve()
    }),
    body("community_can_see_reactions", "community_can_see_reactions invalid").notEmpty().escape().isIn([true, false]),
    body("minimun_likes", "minimun_likes invalid").notEmpty().escape().isInt(),
    body("maximum_dont_understand", "maximum_dont_understand invalid").notEmpty().escape().isInt(),
    body("reaction_filter", "reaction_filter invalid").notEmpty().escape().isIn([true, false]),
    body("participation_mode_available").custom((value: Array<string>, { req }): Promise<void> => {
      return new Promise((resolve, reject) => {
        value.forEach(element => {
          if ([PARTICIPATION_MODE.TEAM, PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP].includes(element) == false) {
            return reject("participation_mode_available invalid")
          }
        });
        if (value.length < 3) {
          return resolve()
        }
        return reject("participation_mode_available invalid")
      })
    }),
    body("participation_mode_chosed", "participation_mode_chosed invalid").custom((value: string, { req }): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (req.body.participation_mode_available.includes(value)) {
          return resolve()
        }
        return reject("participation_mode_chosed invalid")
      })
    }),
    body("time_in_park", "time_in_park invalid").notEmpty().escape().isInt(),
    body("time_expert_feedback", "time_expert_feedback invalid").notEmpty().escape().isInt(),
    body("time_idea_fix", "time_idea_fix invalid").notEmpty().escape().isInt(),
    body("external_contribution_available_for_generators", "external_contribution_available_for_generators invalid").notEmpty().escape().isIn([true, false]),
    body("external_contribution_available_for_committee", "external_contribution_available_for_committee invalid").notEmpty().escape().isIn([true, false])
  ], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_CHALLENGE)

      const challengeController = new ChallengeController();
      if (req.url == URLS.CHALLENGE.CHALLENGE) {
        const challenge = await challengeController.newChallenge(req.body, req.user)
        res
          .status(200)
          .json(challenge)
          .send();
      } else if (req.url == URLS.CHALLENGE.CHALLENGE_PROPOSE) {
        const challenge = await challengeController.newChallengeProposal(req.body, req.user)

        res
          .status(200)
          .json(challenge)
          .send();
      }
    } catch (error) {
      next(error);
    }
  }
);


router.post(URLS.CHALLENGE.CHALLENGE_PROPOSE_PROPOSEID_ACCEPT, [
  authentication,
  acl(RULES.IS_LEADER)
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController();
    const challenge = await challengeController.acceptChallengeProposal(req.params.proposeId)
    res
      .status(200)
      .json(challenge)
      .send();
  } catch (error) {
    next(error)
  }
})

router.post(
  URLS.CHALLENGE.CHALLENGE_CHALLENGEID_SOLUTION,
  [
    authentication,
    acl(
      RULES.CAN_VIEW_CHALLENGE
    ),
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
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
    body("is_privated", VALIDATIONS_MESSAGE_ERROR.SOLUTION.IS_PRIVATE_INVALID).notEmpty().escape().isIn([true, false]),
    /**
     * Solution description
     */
    body("proposed_solution", "proposed_solution can not be empty").notEmpty().escape(),
    /**
     * participation.mode_chosed is like participation_mode_chosed
     */
    body("participation.chosed_mode", "participation.mode_chosed invalid").custom(async (value: string, { req }): Promise<void> => {
      /**
       * Check that participation chosed by user is available
       */
      if (req.resources.challenge.participationModeAvailable.includes(value)) {
        return Promise.resolve()
      }
      return Promise.reject("participation.chosed_mode invalid")
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
        const validComposition = isCompositionUsersValid(creator, guests, req.challenge)
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
        return Promise.reject()
      }
    }),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_SOLUTION)
      const challengeController = new ChallengeController();
      const solution = await challengeController.newSolution(req.body, req.user, req.params.challengeId, req.utils)
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

router.patch(
  URLS.CHALLENGE.CHALLENGE_CHALLENGEID_SOLUTION_SOLUTIONID,
  [
    authentication,
    acl(RULES.CAN_EDIT_SOLUTION),
    /**
      * Check if changes in department_affected happened
      */
    body("department_affected").custom(async (value: string[], { req }): Promise<void> => {
      try {
        let departmentAffected : Array<AreaI>
        if (!value){
          departmentAffected = req.resources.solution.department_affected
          req.utils = { departmentAffected, ...req.utils }
          return Promise.resolve()
        }else {
          departmentAffected = await AreaService.getAreasById(value)
        }

        if (departmentAffected.length == value.length) {
          req.utils = { departmentAffected, ...req.utils }
          return Promise.resolve()
        }
        return Promise.reject("department_affected does not valid")
      } catch (error) {
        return Promise.reject("department_affected does not valid")
      }
    }),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.PATCH_SOLUTION)

      const challengeController = new ChallengeController();
      const resp = await challengeController.updateSolutionPartially(
        req.params.challengeId,
        req.body,
        req.resources,
        req.user,
        req.utils
      )
      res
        .json(resp)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  })

router.get(URLS.CHALLENGE.CHALLENGE, [
  authentication,
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()

    const query: QueryChallengeForm = await formatChallengeQuery(req.query)
    const challenges = await challengeController.listChallenges(query, req.user)

    res
      .json(challenges)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.get(
  URLS.CHALLENGE.CHALLENGE_CHALLENGEID,
  [
    authentication,
    acl(
      RULES.CAN_VIEW_CHALLENGE
    )
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      const challengeController = new ChallengeController();
      const challenge = await challengeController.getChallenge(req.params.challengeId, req.resources.challenge, req.user)

      res
        .json(challenge)
        .status(200)
        .send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/challenge/:challengeId",
  [
    authentication,
  ]
  ,
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.PATCH_SOLUTION)

      const challengeController = new ChallengeController();
      const challenge = await challengeController.updateChallengePartially(req.body, req.params.challengeId)

      res
        .status(200)
        .json(challenge)
        .send();
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/challenge/:challengeId",
  [
    authentication
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      const challengeController = new ChallengeController();
      await challengeController.deleteChallenge(req.params.challengeId)
      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.get(URLS.CHALLENGE.CHALLENGE_CHALLENGEID_SOLUTION, [
  check('init').escape(),
  check('offset').escape(),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {

    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.LISTING_SOLUTIONS)

    const challengeController = new ChallengeController();
    req.query.challengId = req.params.challengeId
    const query: QuerySolutionForm = await formatSolutionQuery(req.query)

    const solutions = await challengeController.listSolutions(
      req.params.challengeId,
      query
    )
    res
      .json(solutions)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post('/challenge/:challengeId/comment', [
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  )
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()
    const resp = await challengeController.newComment(req.params.challengeId, req.body, req.user)
    res
      .json(resp)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.get('/challenge/:challengeId/comment', [
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  )
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()
    const comments = await challengeController.getComments(req.params.challengeId, req.user)
    res
      .json(comments)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post('/challenge/:challengeId/reaction', [
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  )
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()
    const resp = await challengeController.newReaction(req.params.challengeId, req.body, req.user)
    res
      .json(resp)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

const challengeRouter = router
export default challengeRouter;
