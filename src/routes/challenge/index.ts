import * as express from "express";
const router = express.Router();
import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import { NextFunction } from 'express';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
import ChallengeController from '../../controller/challenge'
import { CHALLENGE_TYPE, COMMENT_LEVEL, ERRORS, PARTICIPATION_MODE, RESOURCE, RULES, SOLUTION_STATUS, TAG_ORIGIN, URLS, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import { formatChallengeQuery, QueryChallengeForm } from "../../utils/params-query/challenge.query.params";
import AreaService from "../../services/Area.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import GroupValidatorService from "../../services/GroupValidator.service";
import * as _ from 'lodash';
import toISOData, { getCurrentDate } from "../../utils/general/date";
import TeamService from "../../services/Team.service";
import ConfigurationService from "../../services/Configuration.service";
import TagService from "../../services/Tag.service";
import CommentService from "../../services/Comment.service";
import ChallengeService from "../../services/Challenge.service";
import { query, validationResult, body, check } from "express-validator";
import { tagsBodyCheck, tagsQueryCheck } from "../../utils/sanitization/tagsValidArray.check";
import { areasValidArray } from "../../utils/sanitization/areasValidArray.check";

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
/*
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
*/
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
    body("type").isIn([CHALLENGE_TYPE.GENERIC, CHALLENGE_TYPE.PARTICULAR]),
    /**
     * Just can exist one generic challenge
     */
    body("type").custom(async (value): Promise<void>=> {
      try{
        if (CHALLENGE_TYPE.PARTICULAR == value){
          return Promise.resolve()
        }
        const genericChallenge = await ChallengeService.getGenericChallenge()

        if(genericChallenge) {
          return Promise.reject("generic challenge that exist")
        }
        return Promise.resolve()
      }catch(error){
        return Promise.reject("generic challenge that exist")
      }
    }),
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
    body("tags").isArray(),
    body("tags").custom(async (value: string[], { req }): Promise<void> => {
      try{
        const query = {
          tagId: { $in: value },
          type: TAG_ORIGIN.CHALLENGE
        }
        const tags = await TagService.getTagsByQuery(query)
        if (tags.length == value.length) {
          req.utils = { tags, ...req.utils }
          return Promise.resolve()
        }
        return Promise.reject("tags does not valid")
      }catch(error){
        return Promise.reject("tags does not valid")
      }
    }),
    body("group_validator").custom((value: string, { req }): Promise<void> => {
      try{
        const groupValidator = GroupValidatorService.getGroupValidatorById(value)
        if(groupValidator){
          req.utils = {groupValidator, ...req.utils}
          return Promise.resolve()
        }
        return Promise.reject("Group Validator that not exist")
      }catch(error){
        return Promise.reject("Group Validator that not exist")        
      }
    }),
    body("is_strategic", "is_strategic invalid").notEmpty().escape().isIn([true, false]),
    body("finalization").notEmpty(),
    /**
     * Check that finalization date is in the future
     */
    body("finalization").custom((value: Date): Promise<void> => {
      try{
        const currentDate = toISOData(getCurrentDate())
        const finalizationData = toISOData(value)

        if (finalizationData> currentDate) {
          return Promise.resolve()
        }
        return Promise.reject("Date does not valid. Finalization must be greater than current date")
      }catch(error){
        return Promise.reject("Date does not valid. Finalization must be greater than current date")
      }
    }),
    /**
     * Checking the configuration of allowed solutions.
     */
    body("can_show_disagreement", "can_show_disagreement invalid").notEmpty().escape().isIn([true, false]),
    body("can_fix_disapproved_idea", "can_fix_disapproved_idea invalid").notEmpty().escape().isIn([true, false]),

    body("can_choose_scope", "can_choose_scope invalid").notEmpty().escape().isIn([true, false]),
    body("is_privated", "is_privated invalid").notEmpty().escape().isIn([true, false]),

    body("can_choose_WSALevel", "can_choose_WSALevel invalid").notEmpty().escape().isIn([true, false]),
    body("WSALevel_available").notEmpty(),
    body("WSALevel_available", "WSALevel_available invalid").custom((value: string[], { req }): Promise<void> => {
      try{
        const WSALevel: string[] = _.sortedUniq(value)
        WSALevel.forEach(value => {
          if (![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)) {
            return Promise.reject("WSALevel_available invalid")
          }
        })
        return Promise.resolve()
      }catch(error){
        return Promise.reject("WSALevel_available invalid")
      }
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
        const challenge = await challengeController.newChallenge(req.body, req.user, req.utils)
        res
          .status(200)
          .json(challenge)
          .send();
      } else if (req.url == URLS.CHALLENGE.CHALLENGE_PROPOSE) {
        const challenge = await challengeController.newChallengeProposal(req.body, req.user, req.utils)

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
    )
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_SOLUTION)
      const challengeController = new ChallengeController();
      const solution = await challengeController.newSolution(req.user, req.utils, req.resources.challenge)
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
     * Challenge situation description
     */
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY),
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),    
    body("images", "images does not valid").isArray(),
    tagsBodyCheck(),
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
    body("is_privated", VALIDATIONS_MESSAGE_ERROR.SOLUTION.IS_PRIVATE_INVALID).custom(async (value: string, { req }):Promise<void> => {
      try{
        const is_privated = value
        if(req.resources.solution.canChooseScope){
          if(is_privated in[true, false]){
            return Promise.resolve()
          }
        }else {
          if (is_privated == req.resources.solution.challenge.defaultScope) {
            return Promise.resolve()
          }
        }
        return Promise.reject()
      }catch(error){
        return Promise.reject(error)
      }
    }),
    body("WSALevel_chosed","WSALevel_chosed can not be empty").notEmpty().isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
    body("WSALevel_chosed").custom(async (value: string, { req }): Promise<void> => {
      try {
        /**
          * Check that user can choose WSALevel, otherwise ignore decision. 
          */
        if (req.resources.solution.canChooseWSALevel) {
          /**
            * If user can choose WSALevel, check that WSALevel is valid.
            */
          if (!req.resources.solution.WSALevelAvailable.includes(value)) {
            return Promise.reject(ERRORS.ROUTING.WSALEVEL_NOT_AVAILABLE)
          }
          /**
            * Check that if WSALevel == AREA, user inserted areasId valid.
            */
          if (value == WSALEVEL.AREA) {
            const areas_available = req.body.areas_available
            if (areas_available == undefined || areas_available.length === 0){
              return Promise.reject('Insert at least an area when WSALevel is AREA')
            }
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
    body("proposed_solution").escape(),
 
    /**
      * participation.mode_chosed is like participation_mode_chosed
      */
    body("participation.chosed_mode", "participation.mode_chosed invalid").custom(async (value: string, { req }): Promise<void> => {
      try {
        /**
          * Check that participation chosed by user is available
          */
        if (req.resources.solution.challenge.participationModeAvailable.includes(value)) {
          return Promise.resolve()
        }
        return Promise.reject("participation.chosed_mode invalid")
      } catch (error) {
        return Promise.reject(error)
      }
    }),
    body("participation.chosed_mode").custom(async (value: string, { req }): Promise<void> => {
      try {
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
 
        return Promise.resolve()
         
      } catch (error) {
        return Promise.reject("participation.chosed_mode invalid")
      }
    }),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.PATCH_SOLUTION)

      const challengeController = new ChallengeController();
      const resp = await challengeController.updateSolution(req.params.challengeId,req.params.solutionId, req.body, req.resources, req.user, req.utils)
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
  tagsQueryCheck(),
  areasValidArray(),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()

    const query: QueryChallengeForm = await formatChallengeQuery(req.query, {
      tags: req.utils?.tags,
      departmentAffected: req.utils?.areas,
    })
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
  authentication,
  // !TODO enhance access rule
  acl(RULES.CAN_VIEW_CHALLENGE),
  check('init').escape(),
  check('offset').escape(),
  query('status').optional().isIn(Object.values(SOLUTION_STATUS)),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {

    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.LISTING_SOLUTIONS)

    const challengeController = new ChallengeController();
    req.query.challengeId = req.params.challengeId
    const query: QuerySolutionForm = await formatSolutionQuery(req.query, req.utils)

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

router.post(URLS.CHALLENGE.CHALLENGE_CHALLENGEID_COMMENT, [
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  ),
  body("author","author does not valid").custom(async (value, { req }) => {
    try{
      if(value != req.user.userId){
        return Promise.reject()
      }
      return Promise.resolve()
    }catch(error){
      return Promise.reject()
    }
  }),
  body('comment').isString().trim().escape(),
  body('version', 'version can not be empty').notEmpty(),
  body('scope').isIn([COMMENT_LEVEL.PUBLIC]),
  body('parent').custom(async (value, { req }) => {
    try{
      if(value){
        const parentComment = await CommentService.getComment(value)
        if(!parentComment){
          return Promise.reject("parent not found")
        }
        if(parentComment.parent) {
          return Promise.reject("more that 2 levels of comments")
        }
        req.utils = {...req.utils , parentComment}
      }
      return Promise.resolve()
    }catch(error){
      return Promise.reject("parent validation")
    }
  }),
  body('tag', 'tag does not valid').custom(async (value, {req})=> {
    try{
      const tag = await TagService.getTagById(value)
      if (!tag){
        return Promise.reject('tag does not exist')
      }
      if(req.utils?.parentComment){
        if(req.utils.parentComment.tag.tagId != value ){
          return Promise.reject('tag parent and child does not same')
        }
      }
      req.utils = {...req.utils , tagComment:tag}
      return Promise.resolve()
    }catch(error){
      return Promise.reject(error)
    }
  })
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const challengeController = new ChallengeController()
    // @TODO add comments rules
    const resp = await challengeController.newComment(req.params.challengeId, req.body, req.user, req.utils)
    res
      .json(resp)
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
