import * as express from "express";
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import UserController, { Login } from "../../controller/users";
import { body , query, validationResult} from "express-validator";
import RoutingError from "../../handle-error/error.routing";
import { ERRORS, HTTP_RESPONSE, VIEW_BY } from "../../constants";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";

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

router.delete("/user/:userId", [
  authentication
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const userController = new UserController()
    await userController.delete(req.params.userId)
    res
      .status(204)
      .send();
  } catch (err) {
    next(err);
  }
});

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
  body('new_password').custom(async (value, {req}): Promise<void> => {
    try{
      if(value == req.body.repeat_new_password){
        return Promise.resolve()
      }
      return Promise.reject('new password confirmation failed')
    }catch(error){
      return Promise.reject()
    }
  })
], async (req:RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.CHANGE_PASSWORD)
    const userController = new UserController()
    const userParticipation = await userController.changePassword(req.body.new_password, req.user)
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
const userRouter = router
export default userRouter;
