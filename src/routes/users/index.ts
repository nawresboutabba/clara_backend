import * as express from "express";
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken'
import { NextFunction} from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { nanoid } from 'nanoid'
import UserService from "../../services/User.service";
import authentication from "../../middlewares/authentication";

const router = express.Router();


router.post("/user/signup", [], async (req:RequestMiddleware, res: ResponseMiddleware, next) => {
  let user = await UserService.getUserActiveByEmail(req.body.email);
  try {
    if (user) {
      res.status(409);
      throw new Error("User with this email exist");
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      try {
        if (err) {
          res.status(500);
          throw err;
        }
        const user = await UserService.newGenericUser({
          userId: nanoid(),
          email: req.body.email,
          password: hash,
          firstName: req.body.firt_name,
          lastName:req.body.last_name,
          workSpace: ["ABSOLUTE"],
          active: true,
        });
        if (user instanceof Error) {
          res.status(500);
          throw user;
        }
        res.status(200).json(user).send();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/user/login", async (req:RequestMiddleware, res: ResponseMiddleware, next) => {
  const user = await UserService.getUserActiveByEmail(req.body.email);
  if (user == null) {
    res.status(500);
    next(new Error("Auth failed"));
  }

  bcrypt.compare(req.body.password, user.password, async (err, result) => {
    try {
      if (err || result == false) {
        res.status(500);
        throw new Error("Auth failed");
      }
      const token = sign(
        {
          email: user.email,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res
        .status(200)
        .json({
          message: "Auth successful",
          token: token,
        })
        .send();
    } catch (error) {
      next(error);
    }
  });
});

// @Add authentication middleware
router.delete("/user/:userId", [
  authentication
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    await UserService.deleteUserWithLog(req.params.userId);
    res
    .status(204)
    .send();
  } catch (err) {
    res
    .status(500)
    next(err);
  }
});
const userRouter = router
export default userRouter;
