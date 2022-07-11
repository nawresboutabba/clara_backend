"use strict";
import * as express from "express";
const router = express.Router();
import authentication from "../../middlewares/authentication";
import * as _ from 'lodash';
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { validationResult, body, query, param } from "express-validator";
import SolutionController from '../../controller/solution/index'
import { COMMENT_LEVEL, ERRORS, EVALUATION_NOTE_ROLE, INVITATION, INVITATIONS, PARTICIPATION_MODE, RESOURCE, RULES, SOLUTION_STATUS, TAG_ORIGIN, URLS, VALIDATIONS_MESSAGE_ERROR, WSALEVEL } from "../../constants";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import AreaService from "../../services/Area.service";
import TeamService from "../../services/Team.service";
import UserService from "../../services/User.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import { acl } from "../../middlewares/acl";
import CommentService from "../../services/Comment.service";
import TagService from "../../services/Tag.service";
import BaremoService from "../../services/Baremo.service";
import BaremoStateMachine from "../../utils/state-machine/state-machine.baremo";
import ChallengeService from "../../services/Challenge.service";
import { UserI } from "../../models/users";
import InvitationService from "../../services/Invitation.service";
import * as assert from 'assert';
import { checkProposedSolution } from "../../utils/sanitization/proposedSolution.check";
import { checkDifferential} from "../../utils/sanitization/differential.check";
import { checkIsNewFor} from "../../utils/sanitization/isNewFor.check";
import { checkBaremaTypeSuggested } from "../../utils/sanitization/baremaTypeSuggested.check";
import { checkWasTested } from "../../utils/sanitization/wasTested.check";
import { checkTestDescription } from "../../utils/sanitization/testDescription.check";
import { checkFirstDifficulty } from "../../utils/sanitization/firstDifficulty.check";
import { checkSecondDifficulty } from "../../utils/sanitization/secondDifficulty.check";
import { checkThirdDifficulty } from "../../utils/sanitization/thirdDifficulty.check";
import { checkImplementationTimeInMonths } from "../../utils/sanitization/implementationTimeInMonth.check";
import { checkMoneyNeeded } from "../../utils/sanitization/moneyNeeded.check";



import SolutionStateMachine from "../../utils/state-machine/state-machine.solution";


router.get(
  URLS.SOLUTION.SOLUTION_SOLUTIONID_COMMENT_COMMENTID,
  [
    authentication,
    acl(RULES.CAN_VIEW_COMMENT)
  ], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.GET_COMMENTS)

      const solutionController = new SolutionController()
      const resp = await solutionController.getComments(req.params.commentId, req.resources.solution, req.user, req.utils)
      res
        .json(resp)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  }
)
  
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
    body('tag', 'tag does not valid').custom(async (value, {req}):Promise<void> => {
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
  URLS.SOLUTION.SOLUTION_SOLUTIONID_INVITATION_INVITATIONID_RESPONSE,
  [
    authentication,
    acl(RULES.IS_THE_RECIPIENT_OF_THE_INVITATION),
    body('response').custom(async (value, {req}):Promise<void> => {
      try{
        if(req.utils.invitation.decisionDate){
          return Promise.reject('The invitation has already been answered')
        }
        if (value in INVITATION){
          return Promise.resolve()
        }
        return Promise.reject('Invitation response invalid')
      }catch(error){
        return Promise.reject('invitation invalid')
      }
    })
  ],
  async (req:RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.RESPONSE_INVITATION)
      const solutionController = new SolutionController()
      const resp = await solutionController.responseInvitation(req.params.solutionId, req.params.invitationId, req.body, req.utils)
      res
        .json(resp)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  }
)
/**
 * Query
 * status . [ACCEPTED,REJECTED, PENDING]. array of INVITATION. See in constants
 */
router.get(
  URLS.SOLUTION.SOLUTION_SOLUTIONID_INVITATION,
  [
    authentication,
    acl(RULES.CAN_VIEW_SOLUTION),
    query('status')
      .optional()
      .customSanitizer(value => Array.isArray(value) ? value : [value])
      .custom(async (value, {req}):Promise<void>=> {
        try{
          const result = value.every(element => {
            return element in INVITATION
          })
          assert.ok(result, "status not valid")
          return Promise.resolve()
        }catch(error){
          return Promise.reject("status not valid")
        }
      })
  ],
  async (req:RequestMiddleware, res: ResponseMiddleware, next:NextFunction)=> {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.GET_INVITATIONS)
      const solutionController = new SolutionController()
      const invitations = await solutionController.getInvitations(req.params.solutionId, req.query, req.resources.solution, req.utils)
      res
        .json(invitations)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  }
)

/**
 * Endpoint for an author to invite people to be part of the team
 */
router.post(
  URLS.SOLUTION.SOLUTION_SOLUTIONID_INVITATION,
  [
    authentication, 
    acl(RULES.IS_SOLUTION_CREATOR),
    /**
     * Check that user invitated exist. If not exist, check if is posible to add
     */
    body('email').custom(async (value: string, {req}): Promise<void>=> {
      try{
        const user = await UserService.getUserActiveByEmail(value)
        if (user){
          assert.ok((user.externalUser ==  false || (user.externalUser ==  true && req.body.type == INVITATIONS.EXTERNAL_OPINION)), "External user can participate just with opinion")
          const members = req.resources.solution.coauthor
          const isMember = members.filter((member: UserI)=> member.userId == user.userId)
          if (isMember.length > 0){
            return Promise.reject('this user is already member')
          }
          /**
           * This conditional is redundant. ACL check this
           */
          if(req.user.userId == req.resources.solution.author.userId){
            req.utils = {user, ...req.utils}
            return Promise.resolve()
          }
          return Promise.reject('Operation available just for idea owner')
        }else if (req.body.type == INVITATIONS.EXTERNAL_OPINION){
          /**
           * External user for external opinion is ok
           */
          return Promise.resolve()
        }
        return Promise.reject('user is not valid')
      }catch(error){
        return Promise.reject(error)
      }
    }),
    body('type').custom(async (value: string)=> {
      try{
        if (value in INVITATIONS){
          return Promise.resolve()
        }
        return Promise.reject('Invitation invalid')
      }catch(error){
        return Promise.reject('Invitation invalid')
      }
    }),
    body('email').custom(async (value:string, {req}): Promise<void>=> {
      try{
        const queryUser = {
          email: value,
          active: true
        }
        const to = await UserService.getUsers(queryUser)
        const queryInvitation =  {
          solution: req.resources.solution,
          to: to
        }
        const invitation = await InvitationService.getSolutionInvitations(queryInvitation)
        if (invitation.length > 0){
          return Promise.reject('Invitation for this solution is pending for response')
        }
        return Promise.resolve()
      }catch(error){
        return Promise.reject()
      }
    })
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.CREATE_INVITATION)
      const solutionController = new SolutionController()
      const invitation = await solutionController.newInvitation(req.params.solutionId, req.body, req.utils, req.resources.solution)
      res
        .json(invitation)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  }
)

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
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_SOLUTION)

      const solutionController = new SolutionController()
      const solution = await solutionController.newSolution(req.user, req.utils, req.resources.challenge)
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
  URLS.SOLUTION.SOLUTION,
  [
    authentication
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const solutionController = new SolutionController()
      const query: QuerySolutionForm = await formatSolutionQuery(req.query, req.resources)
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
  URLS.SOLUTION.SOLUTION_SOLUTIONID,
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

/**
 * Body:
 * transition. Can be: confirm or draft at moment.
 * Datails see in state-machine.solution.ts (Contain all transitions)
 */
router.post(
  URLS.SOLUTION.SOLUTION_SOLUTIONID_TRANSITION, 
  [
    authentication,
    acl(RULES.CAN_EDIT_SOLUTION),
    body('transition').custom(async (value:string, {req}):Promise<void>=> {
      try{
        const solution = req.resources.solution
        /**
         * Check if transition is valid
         */
        await SolutionStateMachine.dispatch(solution.status , value)

        return Promise.resolve()
      }catch(error){
        return Promise.reject(error)
      }
    }),
    checkProposedSolution(body),
    checkDifferential(body),
    checkIsNewFor(body),
    checkBaremaTypeSuggested(body),
    checkWasTested(body),
    checkTestDescription(body),
    checkFirstDifficulty(body),
    checkSecondDifficulty(body),
    checkThirdDifficulty(body),
    checkImplementationTimeInMonths(body), 
    checkMoneyNeeded(body),       
  ], async (req:RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.PATCH_SOLUTION)
      const solutionController = new SolutionController()
      const solution = await solutionController.applyTransition(req.params.solutionId, req.body, req.resources.solution)
      res
        .json(solution)
        .status(200)
        .send()
    }catch(error){
      next(error)
    }
  })

/**
 * Endpoint for update solutions
 */
router.patch(
  URLS.SOLUTION.SOLUTION_SOLUTIONID,
  [
    authentication,
    acl(RULES.CAN_EDIT_SOLUTION),
    /**
     * Challenge situation description
     */
    body("title", VALIDATIONS_MESSAGE_ERROR.SOLUTION.TITLE_EMPTY).notEmpty(),    
    body("images", "images does not valid").isArray(),
    body("tags").isArray(),    
    body("tags").custom(async (value: string[], { req }): Promise<void> => {
      try{
        // https://www.notion.so/TAGS-Fix-Tag-comments-according-to-10-th-meeting-dc0ee99aa6f9478daedcc35c0664a34d
        const query = {
          tagId: { $in: value }
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
            if (areas_available == undefined || areas_available == []){
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
    try {
      await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.PATCH_SOLUTION)

      const solutionController = new SolutionController()
      const solution = await solutionController.updateSolution(req.params.solutionId, req.body, req.resources, req.user, req.utils)
      res
        .json(solution)
        .status(200)
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
