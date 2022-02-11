const router = require("express").Router();

import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import { NextFunction } from 'express';
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
const { validationResult, body,check } = require("express-validator");
import ChallengeController from '../../controller/challenge'
import { ERRORS, PARTICIPATION_MODE, RESOURCE, RULES, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import { formatChallengeQuery, QueryChallengeForm } from "../../utils/params-query/challenge.query.params";
import AreaService from "../../services/Area.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import GroupValidatorService from "../../services/GroupValidator.service";
import * as _ from 'lodash'; 
import toISOData,{ getCurrentDate } from "../../utils/date";
import { isCompositionUsersValid } from "../../utils/configuration-rules/participation";
import UserService from "../../services/User.service";
import TeamService from "../../services/Team.service";
import ConfigurationService from "../../services/Configuration.service";

router.get("/challenge/default-configuration", [
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    const challengeController = new ChallengeController()
    const challengeConfiguration =  await challengeController.getChallengeDefaultConfiguration()
    res
    .json(challengeConfiguration)
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})

router.post("/challenge/default-configuration",[
  authentication,
  acl(RULES.IS_LEADER),
/*   check("", 'challenge configuration already exist').custom((value:string, {req}): Promise<void>=> {
    return new Promise(async (resolve, reject)=> {
      const currentConfiguration = await ConfigurationService.getConfigurationDefault(RESOURCE.CHALLENGE)
      if (currentConfiguration){
        return reject()
      }
      return resolve()
    })
  }), */
  body("can_show_disagreement").isBoolean(),
  body("disagreement_default").isBoolean(),
  body("can_fix_desapproved_idea").isBoolean(),
  body("can_choose_scope").isBoolean(),
  body("is_private_default").isBoolean(),
  body("can_choose_WSALevel").isBoolean(),
  check("WSALevel_available", "WSALevel_available invalid").custom((value: string[], {req}): Promise<void>=> {
    return new Promise(async (resolve, reject)=> {
      const WSALevel: string [] = _.sortedUniq(value)
      WSALevel.forEach(value => {
        if(![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)){
          return reject("WSALevel_available invalid")
        }
      })
      return resolve()
    })     
  }),
  body("WSALevel_default").isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
  body("community_can_see_reactions").isBoolean(),
  body("maximun_dont_understand").isInt({min:0}),
  body("minimun_likes").isInt({min:0}),
  body("reaction_filter").isBoolean(),
  body("external_contribution_available_for_generators").isBoolean(),
  body("external_contribution_available_for_committee").isBoolean(),
  body("participation_mode_available", 'participation_mode_available invalid').custom((value: string[], {req}): Promise<void>=> {
    return new Promise(async (resolve, reject)=> {
      const participationModeAvailable: string [] = _.sortedUniq(value)
      participationModeAvailable.forEach(value => {
        if(![PARTICIPATION_MODE.TEAM,PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP].includes(value)){
          return reject("participation_mode_available invalid")
        }
      })
      return resolve()
    })     
  }),
  body("time_in_park").isInt(),
  body("time_expert_feedback").isInt(),
  body("time_idea_fix").isInt(),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.CHALLENGE_CONFIGURATION)

    const challengeController = new ChallengeController()
    const challengeConfiguration =  await challengeController.setChallengeDefaultConfiguration(req.body)
    res
    .json(challengeConfiguration)
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})

router.post(
  "/challenge",
  [
    authentication,
    acl(
      RULES.IS_COMMITTE_MEMBER
    ),
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
    body("images", "images does not valid").isArray(),
    body("department_affected").isArray(),
    body("department_affected" ).custom((value: string[], {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        const departmentAffected = await AreaService.getAreasById(body.department_affected)       
        if(departmentAffected.length == value.length){
          req.utils = departmentAffected
          return resolve()
        }
        return reject("department_affected does not valid")
      })
    }),
    check("group_validator", "group_validator invalid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async(resolve, reject)=> {
        const groupValidator = await GroupValidatorService.getGroupValidatorById(req.body.group_validator)
        if(groupValidator){
          req.utils = groupValidator
          return resolve()
        }
        return reject()
      })
    }),
    body("is_strategic", "is_strategic invalid").notEmpty().escape().isIn([true, false]),
    body("finalization", "finalization invalid").notEmpty(),
    body("finalization").custom((value: Date, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        if(toISOData(value) > getCurrentDate()){
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
    body("WSALevel_available", "WSALevel_available invalid").custom((value: string[], {req}): Promise<void>=> {
      return new Promise((resolve, reject)=> {
        const WSALevel: string [] = _.sortedUniq(value)
        WSALevel.forEach(value => {
          if(![WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)){
            return reject("WSALevel_available invalid")
          }
        })
        return resolve()
      })
    }),
    body("WSALevel_chosed", "WSALevel_chosed invalid").isIn([WSALEVEL.COMPANY, WSALEVEL.AREA]),
    
    body("areas_available", "areas_available invalid").custom((value: string[], {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        if(req.body.WSALevel_chosed == WSALEVEL.AREA){
          const areasAvailable = await AreaService.getAreasById(_.sortedUniq(value))       

          if(areasAvailable.length > 0){
            req.utils = areasAvailable
            return resolve()
          }else {
            return reject("areas_available can not be empty when WSALevel_chosed = AREA")          
          }
        }
        return resolve()
      })
    }),
    body("community_can_see_reactions", "community_can_see_reactions invalid").notEmpty().escape().isIn([true, false]),
    body("minimun_likes", "minimun_likes invalid").notEmpty().escape().isInt(),
    body("maximum_dont_understand", "maximum_dont_understand invalid").notEmpty().escape().isInt(),
    body("reaction_filter", "reaction_filter invalid").notEmpty().escape().isIn([true, false]),
    body("participation_mode_available").custom((value:Array<string> , {req}): Promise<void>=> {
      return new Promise((resolve, reject)=> {
        value.forEach(element => {
          if ([PARTICIPATION_MODE.TEAM,PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP].includes(element) == false){
            return reject("participation_mode_available invalid")
          }
        });
          if(value.length <3){
            return resolve()
          }
          return reject("participation_mode_available invalid")
      })
    }),
    body("participation_mode_chosed", "participation_mode_chosed invalid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        if(req.body.participation_mode_available.includes(value)){
          return resolve()
        }
        return reject("participation_mode_chosed invalid")
      })
    }),
    body("time_in_park", "time_in_park invalid").notEmpty().escape().isInt(),
    body("time_expert_feedback", "time_expert_feedback invalid").notEmpty().escape().isInt(),
    body("time_idea_fix", "time_idea_fix invalid").notEmpty().escape().isInt(),
    body("external_contribution_available_for_generators", "external_contribution_available_for_generators invalid").notEmpty().escape().isIn([true, false]),
    body("external_contribution_available_for_committee", "external_contribution_available_for_committee invalid").notEmpty().escape().isIn([true, false]),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.ADD_CHALLENGE)

      const challengeController = new ChallengeController();
      const challenge = await challengeController.newChallenge(req.body, req.user)
      res
      .status(200)
      .json(challenge)
      .send();
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/challenge/:challengeId/solution",
  [
    authentication,
    acl(
      RULES.CAN_VIEW_CHALLENGE
    ),
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
    body("images", "images does not valid").isArray(),
    body("department_affected").isArray(),
    body("department_affected" ).custom((value: string[], {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        try{
          const departmentAffected = await AreaService.getAreasById(value)       
          if(departmentAffected.length == value.length){
            req.utils = {departmentAffected, ...req.utils}
            return resolve()
          }
          return reject("department_affected does not valid")
        }catch(error){
          return reject("department_affected does not valid")
        }

      })
    }),
    body("is_privated", VALIDATIONS_MESSAGE_ERROR.SOLUTION.IS_PRIVATE_INVALID).notEmpty().escape().isIn([true, false]),
    /**
     * participation.mode_chosed is like participation_mode_chosed
     */
    body("participation.chosed_mode", "participation.mode_chosed invalid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        /**
         * Check that participation chosed by user is available
         */
        if(req.resources.challenge.participationModeAvailable.includes(value)){
          return resolve()
        }
        return reject("participation.chosed_mode invalid")
      })
    }),
    body("participation.chosed_mode" ).custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        const creator = await UserService.getUserActiveByUserId(req.body.participation.creator)
        const guests = await UserService.getUsersById(req.body.participation.guests)
        /**
         * if any of the members who are going to participate does not exist.
         */
        if( !guests.length == req.body.participation.guests.length || !creator){
          return reject("participation integrants is not valid")
        }
        const validComposition = isCompositionUsersValid(creator, guests, req.challenge)
        if(value == PARTICIPATION_MODE.TEAM && !req.body.participation.team_name){
          return reject("participation.team_name is required")
        }
        /**
         * Check that team_name does not exist
         */
        if(value == PARTICIPATION_MODE.TEAM && req.body.participation.team_name){
          const team = await TeamService.getTeamByName(req.body.participation.team_name)
          if(team){
            return reject("team_with this name already exist")
          }
        }

        /**
         * Check if all users are allowed
         */
        if(validComposition){
          req.utils = {creator, guests, ...req.utils}
          return resolve()
        }
        return reject("invalid composition. Invitations to externals users not availible for this user")
      })
    }),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.ADD_SOLUTION)
      const challengeController = new ChallengeController();
      const solution = await challengeController.newSolution(req.body, req.user,  req.params.challengeId , req.utils)
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

router.get('/challenge',[
  authentication,
], async (req: RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=> {
  try{
    const challengeController = new ChallengeController()

    const query: QueryChallengeForm = await formatChallengeQuery(req.query)
    const challenges = await challengeController.listChallenges(query)
  
    res
    .json(challenges)
    .status(200)
    .send()    
  }catch(error){
    next(error)
  }
})

router.get(
  `/challenge/:challengeId`,
  [
    authentication,
    acl(
      RULES.CAN_VIEW_CHALLENGE
    )
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      const challengeController = new ChallengeController();
      const challenge = await challengeController.getChallenge(req.resources.challenge,  req.params.challengeId)
      
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
  [checkResourceExistFromParams("challenges"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.PATCH_SOLUTION)

      const challengeController = new ChallengeController();
      const challenge = await challengeController.updateChallengePartially(req.body,  req.params.challengeId)

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
  [checkResourceExistFromParams("challenges"), 
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

router.get('/challenge/:challengeId/solution',[
  check('init').escape(),
  check('offset').escape(),
],
async (req:RequestMiddleware ,res: ResponseMiddleware,next:NextFunction)=> {
  try {

    await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.LISTING_SOLUTIONS)

    const challengeController = new ChallengeController();
    const query: QuerySolutionForm = await formatSolutionQuery(req.query)

    const solutions = await challengeController.listSolutions(
      req.params.challengeId,
      query
      )
    res
    .json(solutions)
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})

router.post('/challenge/:challengeId/comment',[
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  )
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
      const challengeController = new ChallengeController()
      const resp = await challengeController.newComment( req.params.challengeId, req.body, req.user)
      res
      .json(resp)
      .status(200)
      .send()
    }catch(error){
      next(error)
    }
})

router.get('/challenge/:challengeId/comment',[
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  )
], async (req: RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=> {
  try{
    const challengeController = new ChallengeController()
    const comments = await challengeController.getComments(req.params.challengeId, req.user)
    res
    .json(comments)
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})

router.post('/challenge/:challengeId/reaction',[
  authentication,
  acl(
    RULES.CAN_VIEW_CHALLENGE
  )
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
      const challengeController = new ChallengeController()
      const resp = await challengeController.newReaction( req.params.challengeId, req.body, req.user)
      res
      .json(resp)
      .status(200)
      .send()
    }catch(error){
      next(error)
    }
})

const challengeRouter = router
export default challengeRouter;
