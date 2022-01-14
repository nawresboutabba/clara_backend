const router = require("express").Router();

import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import { NextFunction } from 'express';
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
const { validationResult, body,check } = require("express-validator");
import ChallengeController from '../../controller/challenge'
import RoutingError from "../../handle-error/error.routing";
import { ERRORS, HTTP_RESPONSE, RULES, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import { formatChallengeQuery, QueryChallengeForm } from "../../utils/params-query/challenge.query.params";
import AreaService from "../../services/Area.service";
import ChallengeService from "../../services/Challenge.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";

router.post(
  "/challenge",
  [
    authentication,
    acl(
      RULES.IS_COMMITTE_MEMBER
    ),
    body("description", "description can not be empty").notEmpty(),
    body("title", "title can not be empty").notEmpty(),
    /**
     * participation could be TEAM OR INDIVIDUAL_WITH_COAUTHORSHIP or both
     */
    body("participation_mode").custom((value:Array<string> , {req}): Promise<void>=> {
      return new Promise((resolve, reject)=> {
        value.forEach(element => {
          if (["TEAM", "INDIVIDUAL_WITH_COAUTHORSHIP"].includes(element) == false){
            return reject("participation_mode invalid")
          }
        });
          if(value.length <3){
            return resolve()
          }
          return reject("participation_mode invalid")
      })
    }),
    /**
     * @see SituationI for details about the combination between WSALevel and areas_available
     */
    check("WSALevel", "WSALevel invalid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        if(['COMPANY', 'AREA'].includes(value)){
          if (value == "AREA"){
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
    check("WSALevel", VALIDATIONS_MESSAGE_ERROR.SOLUTION.WSALEVEL_INVALID).isIn([WSALEVEL.AREA,WSALEVEL.COMPANY]),
    /**
     * Check that solution participation modality according to challenge participation modality
     */
    check("author","Author isn't valid").custom((value: string, {req}): Promise<void>=> {
      return new Promise(async (resolve, reject)=> {
        const challenge = await ChallengeService.getChallengeActiveById(req.params.challengeId)
        
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

const challengeRouter = router
export default challengeRouter;
