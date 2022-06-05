"use strict";
import * as express from "express";
const router = express.Router();
import authentication from "../../middlewares/authentication";
import * as _ from 'lodash';
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { validationResult, body, query, param } from "express-validator";
import SolutionController from '../../controller/solution/index'
import { COMMENT_LEVEL, ERRORS, EVALUATION_NOTE_ROLE, PARTICIPATION_MODE, RESOURCE, RULES, SOLUTION_STATUS, TAG_ORIGIN, URLS, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import AreaService from "../../services/Area.service";
import TeamService from "../../services/Team.service";
import { isCompositionUsersValid } from "../../utils/configuration-rules/participation";
import UserService from "../../services/User.service";
import ConfigurationService from "../../services/Configuration.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import { acl } from "../../middlewares/acl";
import CommentService from "../../services/Comment.service";
import TagService from "../../services/Tag.service";
import BaremoService from "../../services/Baremo.service";
import BaremoStateMachine from "../../utils/state-machine/state-machine.baremo";
import ChallengeService from "../../services/Challenge.service";


  
router.get(
  URLS.SOLUTION.COMMENT,
  [
    authentication,
    acl(RULES.CAN_VIEW_SOLUTION),
    query('scope').isIn([COMMENT_LEVEL.GROUP, COMMENT_LEVEL.PUBLIC]),
    query('scope').custom(async (value, { req }) => {
      try{
        if(value == COMMENT_LEVEL.GROUP){
          const solution = req.resources.solution
          const user = req.user
          const responsibles = solution.coauthor.map(coauthor => coauthor.userId)
          responsibles.push(solution.author.userId)
          if(responsibles.includes(user.userId) == false){
            throw 'You are not authorized to see this comments'
          }
        }

        return Promise.resolve()
      }catch(error){
        return Promise.reject(error)
      }
    }),
  ], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.GET_COMMENTS)

      const solutionController = new SolutionController()
      const resp = await solutionController.listComments(req.params.solutionId, req.query, req.resources.solution, req.user)
      res
        .json(resp)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  })

router.post(
  URLS.SOLUTION.COMMENT,
  [
    authentication,
    acl(RULES.CAN_VIEW_SOLUTION),
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
    body('scope').isIn([COMMENT_LEVEL.GROUP, COMMENT_LEVEL.PUBLIC]),
    body('scope').custom(async (value, { req }) => {
      try{
        if(value == COMMENT_LEVEL.GROUP){
          const solution = req.resources.solution
          const user = req.user
          const responsibles = solution.coauthor.map(coauthor => coauthor.userId)
          responsibles.push(solution.author.userId)
          if(responsibles.includes(user.userId) == false){
            throw 'You are not authorized to post comments in this solution as responsible'
          }
        }

        return Promise.resolve()
      }catch(error){
        return Promise.reject(error)
      }
    }),
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
    try{

      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_COMMENT)

      const solutionController = new SolutionController()
      const resp = await solutionController.newComment(
        req.params.solutionId, 
        req.body, 
        req.resources.solution, 
        req.user,
        req.utils
      )
      
      res
        .json(resp)
        .status(201)
        .send();
    } catch(error){
      next(error)
    }
  })

router.post(
  URLS.SOLUTION.SOLUTION,
  [
    authentication,
    /**
     * This item that not exist in request. "generic_challenge_exist" is validation wich the
     * goal is check that generic challenge was created, Remember that ideas free are associated
     * to GENERIC CHALLENGE
     */
    body("generic_challenge_exist").custom(async (value: any, { req }): Promise<void>=> {
      try{
        const challenge = await ChallengeService.getGenericChallenge()
        if (challenge){
          req.resources  = {challenge, ...req.resource}
          return Promise.resolve()
        }
        return Promise.reject()
      }catch(error){
        return Promise.reject()
      }
    }),

    /**
     * Challenge situation description
     */
    body("description", VALIDATIONS_MESSAGE_ERROR.SOLUTION.DESCRIPTION_EMPTY).notEmpty(),
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),
    body('banner_image').isString(),
    body("images", "images does not valid").isArray(),
    body("tags").isArray(),
    body("tags").custom(async (value: string[], { req }): Promise<void> => {
      try{
        const query = {
          tagId: { $in: value },
          type: TAG_ORIGIN.IDEA
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
        if (req.resources.challenge.canChooseWSALevel) {
          /**
           * If user can choose WSALevel, check that WSALevel is valid.
           */
          if (!req.resources.challenge.WSALevel_available.includes(value)) {
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
        if (req.resources.challenge.participationModeAvailable.includes(value)) {
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
      const solution = await solutionController.newSolution(req.body, req.user, req.utils, req.resources.challenge)
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
      const solution = await solutionController.getSolution(req.params.solutionId, req.resources.solution, req.user)
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
        if (req.resources.challenge.canChooseWSALevel) {
          /**
         * If user can choose WSALevel, check that WSALevel is valid.
         */
          if (!req.resources.challenge.WSALevel_available.includes(value)) {
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

/**
 * This endpoint initialize a baremo. If this is a first baremo open, then 
 * idea status have to change to : READY_FOR_ANALYSIS --> ANALYZING
 * https://www.notion.so/Implement-analysis-step-endpoints-Part-II-678f92e5a4434cfc9564d2903a46fabb
 */
router.post([
  URLS.SOLUTION.SOLUTION_SOLUTIONID_BAREMO_GROUPVALIDATOR,
], [
  authentication,
  acl(RULES.IS_VALIDATOR_OF_SOLUTION),
  /**
   * Check that this user don't have another baremo open for this solution.
   * If exist a baremo with this USER-SOLUTION then the operation have to be GET or PATCH
   */
  param('solutionId').custom(async (value, {req})=> {
    try{
      const baremo = await BaremoService.getCurrentBaremoByUserAndSolution(req.resources.solution, req.user)
      if(baremo){
        return Promise.reject("this user has a baremo open for this solution")
      }
      return Promise.resolve()
    }catch(error){
      return Promise.reject("this user has a baremo open for this solution")
    }
  }),
  /**
   * Check if solution is available for analysis
   */
  param('solutionId').custom(async (value, {req})=> {
    try{
      const status = req.resources.solution.status
      const valid = [SOLUTION_STATUS.ANALYZING, SOLUTION_STATUS.READY_FOR_ANALYSIS]
      if (!valid.includes(status)){
        return Promise.reject('anaysis not available for this solution status')
      }
      return Promise.resolve()
    }catch(error){
      return Promise.reject(error)
    }
  })
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.NEW_BAREMO)

    const solutionController = new SolutionController()
    const baremo = await solutionController.newBaremo(req.params.solutionId, req.resources.solution, req.user, req.utils)
    
    res
      .json(baremo)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

router.put([
  URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID,
  URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_FINISH,
  URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_REOPEN,
],[
  authentication,
  acl(RULES.IS_BAREMO_CREATOR),
  body('comment').notEmpty(),
  /**
   * Artificial attribute. Does not exist. Is used just for create the check operation
   */
  body('transition').custom(async(value, {req})=> {
    try{
      if (req.url == URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_FINISH.replace(':baremoId',req.params.baremoId)){
        const status = BaremoStateMachine.dispatch(req.utils.baremo.status , "confirm")
        req.body = {...req.body, status }
      }else if (req.url == URLS.SOLUTION.SOLUTION_BAREMO_BAREMOID_REOPEN.replace(':baremoId',req.params.baremoId)) {
        const status = BaremoStateMachine.dispatch(req.utils.baremo.status , "reopen")
        req.body = {...req.body, status }
      }
      return Promise.resolve()
    }catch(error){
      return Promise.reject(error)
    }
  })
  /**
   * Add SOLUTION.STATUS = 'ANALYZING' condition
   */
], async (req: RequestMiddleware , res: ResponseMiddleware, next: NextFunction) => {
  try {
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.NEW_BAREMO)
    const solutionController = new SolutionController()
    const baremo = await solutionController.editBaremo(req.params.baremoId, req.body, req.utils.baremo )
    res
      .json(baremo)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

/**
 * Get current Baremo for an user for solution. User is obtained from session
 */
router.get(URLS.SOLUTION.SOLUTION_SOLUTIONID_BAREMO_GROUPVALIDATOR_CURRENT,[
  authentication,
  acl(RULES.IS_VALIDATOR_OF_SOLUTION),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    const solutionController = new SolutionController()
    const baremo = await solutionController.getCurrent(req.params.solutionId, req.resources.solution, req.user)
    res
      .json(baremo)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
});

router.post('/solution/:solutionId/evaluation-note',[
  authentication,
  /**
    * Check that validator can do this action
    */
  acl(RULES.IS_VALIDATOR_OF_SOLUTION),
  body('title','title can not be empty').notEmpty(),
  body('description', 'description can not be empty').notEmpty(),
  body('type', 'type is not valid').isIn([EVALUATION_NOTE_ROLE.GROUP_VALIDATOR]),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    const solutionController = new SolutionController()
    const note = await solutionController.evaluationNote(req.params.solutionId, req.body, req.resources.solution, req.user)
    res
      .json(note)
      .status(200)
      .send()
  
  }catch(error){
    next(error)
  }
})


const solutionsRouter = router
export default solutionsRouter;
