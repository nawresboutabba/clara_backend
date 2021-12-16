import * as express from "express";
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import UserController from "../../controller/users";
import { body , validationResult} from "express-validator";
import RoutingError from "../../handle-error/error.routing";
import { ERRORS, HTTP_RESPONSE } from "../../constants";

const router = express.Router();

router.post("/user/signup", [
  body('email', 'email can not be empty').notEmpty(),
  body('password', 'password can not be empty').notEmpty(),
  body('password_confirmation', 'password_confirmation can not be empty').notEmpty(),
  body('first_name','first_name can not be empty').notEmpty(),
  body('last_name','last_name can not be empty').notEmpty()
], async (req:RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
  
  try {

    const errors = validationResult(req).array();
    if (errors.length > 0) {
      const customError = new RoutingError(
        ERRORS.ROUTING.SIGNUP_USER,
        HTTP_RESPONSE._400,
        errors
        )
      throw customError;
    } 
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
const userRouter = router
export default userRouter;
