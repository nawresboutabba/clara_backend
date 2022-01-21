const router = require("express").Router();

import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import { NextFunction } from 'express';
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
const { validationResult, body,check } = require("express-validator");
import ChallengeController from '../../controller/challenge'
import { ERRORS, PARTICIPATION_MODE, RULES, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import { formatChallengeQuery, QueryChallengeForm } from "../../utils/params-query/challenge.query.params";
import AreaService from "../../services/Area.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import { ChallengeI } from "../../models/situation.challenges";
import GroupValidatorService from "../../services/GroupValidator.service";

router.post(
  "/challenge",
  [
    authentication,
    acl(
      RULES.IS_COMMITTE_MEMBER
    ),
    body("description", "description can not be empty").notEmpty(),
    body("title", "title can not be empty").notEmpty(),
    check("group_validator", "group_validator invalid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async(resolve, reject)=> {
        const groupValidator = await GroupValidatorService.getGroupValidatorById(req.body.group_validator)
        if(groupValidator){
          return resolve()
        }
        return reject()
      })
    }),
    /**
     * Checking the configuration of allowed solutions.
     */
    body("can_choose_scope", "can_choose_scope invalid").notEmpty().escape().isIn([true, false]),
    body("is_private", "is_private invalid").notEmpty().escape().isIn([true, false]),
    body("filter_reaction_filter", "filter_reaction invalid").notEmpty().escape().isIn([true, false]),
    body("filter_minimun_likes", "filter_minimun_likes invalid").notEmpty().escape().isInt(),
    body("filter_maximum_dont_understand", "filter_maximum_dont_understand invalid").notEmpty().escape().isInt(),
    body("community_can_see_reactions", "community_can_see_reactions invalid").notEmpty().escape().isIn([true, false]),
    body("can_show_disagreement", "can_show_disagreement invalid").notEmpty().escape().isIn([true, false]),
    body("can_fix_disapproved_idea", "can_fix_disapproved_idea invalid").notEmpty().escape().isIn([true, false]),
    body("time_in_park", "time_in_park invalid").notEmpty().escape().isInt(),
    body("time_expert_feedback", "time_expert_feedback invalid").notEmpty().escape().isInt(),
    body("time_idea_fix", "time_idea_fix invalid").notEmpty().escape().isInt(),
    /**
     * @see SituationI for details about the combination between WSALevel and areas_available
     */
     check("WSALevel", "WSALevel invalid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        if([WSALEVEL.COMPANY, WSALEVEL.AREA].includes(value)){
          if (value == WSALEVEL.AREA){
            const areas = await AreaService.getAreasById(req.body.areas_available)
            if(areas.length == req.body.areas_available.length){
              return resolve()
            }
            return reject("Array area invalid")
          }
          return resolve()
        }
        return reject("WSALevel invalid")
      })     
    }),
    /**
     * participation could be TEAM OR INDIVIDUAL_WITH_COAUTHORSHIP or both
     */
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
    body("is_strategic", "is_strategic invalid").notEmpty().escape().isIn([true, false]),
    body("external_contribution_available", "external_contribution_available invalid").notEmpty().escape().isIn([true, false]),
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
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
    check("is_private", VALIDATIONS_MESSAGE_ERROR.SOLUTION.IS_PRIVATE_INVALID).isIn(["true", "false"]),
    /**
     * WorkSpaceAvailable depends on Challenge.WSA
     */
    //check("WSALevel", VALIDATIONS_MESSAGE_ERROR.SOLUTION.WSALEVEL_INVALID).isIn([WSALEVEL.AREA,WSALEVEL.COMPANY]),
    /**
     * Check that solution participation modality according to challenge participation modality
     */
    check("participation.chosen_mode","PARTICIPATION_MODE_INVALID").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        const challenge: ChallengeI = req.resources.challenge
        if (challenge.participationMode.includes(value)){
          return resolve()
        }
        return reject()
      })
    })
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {

      await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.ADD_SOLUTION)
      const challengeController = new ChallengeController();
      const solution = await challengeController.newSolution(req.body, req.user, req.params.challengeId)
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

router.post('/challenge/default-configuration',[
], (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    const challengeController = new ChallengeController()
    const challengeConfiguration = challengeController.setChallengeDefaultConfiguration(req.body)
    res
    .json(challengeConfiguration)
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})
const challengeRouter = router
export default challengeRouter;
