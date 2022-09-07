import * as express from "express";
import { usersController } from "../../controller/users/users.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const usersRouter = express.Router();

usersRouter
  .use(oldRoute)
  .get("/user/invitation", authentication, usersController.usersInvites);
