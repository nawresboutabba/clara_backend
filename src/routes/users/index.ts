import * as express from "express";
import { NextFunction} from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import UserController from "../../controller/users";

const router = express.Router();

router.post("/user/signup", [], async (req:RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
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
const userRouter = router
export default userRouter;
