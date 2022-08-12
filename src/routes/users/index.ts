import * as express from "express";
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import UserController from "../../controller/users";
import { body , query, validationResult} from "express-validator";
import RoutingError from "../../handle-error/error.routing";
import { ERRORS, HTTP_RESPONSE, INVITATION, URLS, VIEW_BY } from "../../constants";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import * as assert from 'assert';
import * as _ from 'lodash';


const router = express.Router();

router.post("/user/signup", [
  body('email', 'email can not be empty').notEmpty(),
  body('password', 'password can not be empty').notEmpty(),
  body('password_confirmation', 'password_confirmation can not be empty').notEmpty(),
  body('first_name','first_name can not be empty').notEmpty(),
  body('last_name','last_name can not be empty').notEmpty(),
  body('username', "username can not be empty").notEmpty()
], async (req:RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
  
  try {
    await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.SIGNUP_USER)

    const userController = new UserController()
    const response = await userController.signUp(req.body)
    res
      .json(response)
      .status(200)
      .send()
  } catch (err) {
    next(err);
  }
});

router.post("/user/login",[
  body('email', 'email can not be empty').notEmpty(),
  body('password', 'password can not be empty').notEmpty(),
], async (req:RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try{
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      const customError = new RoutingError(
        ERRORS.ROUTING.ADD_SOLUTION,
        HTTP_RESPONSE._400,
        errors
      )
      throw customError;
    } 
    const userController = new UserController()
    const response = await userController.login(req.body)
    res
      .status(200)
      .json({
        message: "Auth successful",
        token: response,
      })
      .send();
  } catch (error){
    next(error)
  }
});

router.patch("/user", authentication, [
  body('first_name'),
  body('last_name'),
  body('user_image'),
  body('username'),
  body('about'),
  body('linkedIn'),
], async (req:RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
  try {
    await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.UPDATE_USER)

    const userController = new UserController()
    const response = await userController.update(req.user.userId, req.body)
    res
      .json(response)
      .status(200)
      .send()
  } catch (err) {
    next(err);
  }
});

// router.delete("/user/:userId", [
//   authentication
// ], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
//   try {
//     const userController = new UserController()
//     await userController.delete(req.params.userId)
//     res
//       .status(204)
//       .send();
//   } catch (err) {
//     next(err);
//   }
// });

router.get('/user/info',[
  authentication
],async (req: RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=>{
  try{
    const userController = new UserController()

    const userInformation = await userController.getInformation(req.user)
    res
      .json(userInformation)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

router.post('/user/change-password', [
  authentication,
  body('new_password'),
  body('old_password'),
], async (req:RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.CHANGE_PASSWORD)
    const userController = new UserController()
    const userParticipation = await userController.changePassword(req.body.new_password, req.body.old_password, req.user)
    res
      .json(userParticipation)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

router.get('/user/participation',[
  authentication,
  query('view_by', 'view can not be empty').notEmpty().isIn([VIEW_BY.CHALLENGE, VIEW_BY.SOLUTION])
],async (req: RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=>{
  try{
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.GET_MY_PARTICIPATION)

    const userController = new UserController()
    const userParticipation = await userController.getParticipation(req.user, req.query)
    res
      .json(userParticipation)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})
/**
 * Query
 * email: String. Looking by fuzzy
 * user_id: String. Looking just for coincidence 100%
 */
router.get(URLS.USER.USER,[
  authentication,
], async (req:RequestMiddleware , res: ResponseMiddleware, next:NextFunction) => {
  try{
    const userController = new UserController()
    const userParticipation = await userController.getUsers(req.query)
    res
      .json(userParticipation)
      .status(200)
      .send()  
  }catch(error){
    next(error)
  }
})

/**
 * User's invitation. My invitations.
 * Query
 * status: undefined || [ACCEPTED, REJECTED, PENDING] . See constants.ts. Pending
 * E.G /user/invitation?status=ACCEPTED&status=REJECTED&status=PENDING
 */
router.get(URLS.USER.USER_INVITATION,[
  authentication,
  query('status').custom(async (value, {req}):Promise<void>=> {
    try{
      if (!value){
        return Promise.resolve()
      }
      if (_.isString(value)){
        assert.ok(value in INVITATION, "status not valid")
        return Promise.resolve()
      }
      const result = value.every(element => {
        return element in INVITATION
      })
      assert.ok(result, "status not valid")
      return Promise.resolve()
    }catch(error){
      return Promise.reject("status not valid")
    }
  })  
],async (req:RequestMiddleware , res: ResponseMiddleware, next:NextFunction) => {
  try{
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.GET_INVITATIONS)
    const userController = new UserController()
    const userParticipation = await userController.getInvitations(req.query, req.user)
    res
      .json(userParticipation)
      .status(200)
      .send()  
  }catch(error){
    next(error)
  }
})
const userRouter = router
export default userRouter;
