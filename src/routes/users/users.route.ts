import * as express from "express";
import * as usersController from "./users.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const usersRouter = express.Router();

usersRouter
  .use(oldRoute)
  .use(authentication)
  .get("/user/invitation", usersController.usersInvites)
  .get("/user/participation/challenge", usersController.participatedChallenges);
