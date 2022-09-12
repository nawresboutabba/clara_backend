import * as express from "express";
import { invitationController } from "../../controller/invitation";
import authentication from "../../middlewares/authentication";

export const invitationRouter = express.Router();

invitationRouter
  .use(authentication)
  .get("/invitations/:invitationId", invitationController.getInvitation);
