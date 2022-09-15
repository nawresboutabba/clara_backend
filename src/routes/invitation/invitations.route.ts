import * as express from "express";
import * as  controller from "./controller";
import authentication from "../../middlewares/authentication";

export const invitationRouter = express.Router();

invitationRouter
  .use(authentication)
  .get("/invitations/:invitationId", controller.getInvitation);
