import * as express from "express";
import { NextFunction} from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import UserController from "../../controller/users";
import { body } from "express-validator";

const router = express.Router();

router.post("/user/signup", [
  body('email', 'email can not be empty').notEmpty(),
  body('password', 'password can not be empty').notEmpty(),
  body('password_confirmation', 'password_confirmation can not be empty').notEmpty(),
  body('first_name','first_name can not be empty').notEmpty(),
  body('last_name','last_name can not be empty').notEmpty()
], async (req:RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
  try {
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

router.post("/user/login", async (req:RequestMiddleware, res: ResponseMiddleware, next) => {

  try{
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

// @Add authentication middleware
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

router.post('/user/:userId/company/:companyId',[
  // @TODO operation available only for committe
  authentication
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    const userController = new UserController()
    const resp = await userController.addUserInCompany(req.params.userId,req.params.companyId )
    res
    .json({resp})
    .status(200)
    .send()
  }  catch(error){
      next(error)
  }
  })

router.delete('/user/:userId/company/:companyId',[

], async (req : RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=> {
  try{
    const userController = new UserController()
    const resp = await userController.deleteCompanyInUser(req.params.userId,req.params.companyId )
    res
    .json({resp})
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})


router.get('/user/:userId/company/:companyId',[
], async (req: RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=> {
    try{
      const userController = new UserController()
      const resp = await userController.checkUserInCompany(req.params.userId,req.params.companyId )
      res
      .status(200)
      .json(resp)
      .send()
    }catch(error){
      next(error)
    }
})
const userRouter = router
export default userRouter;
