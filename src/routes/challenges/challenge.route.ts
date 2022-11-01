import * as express from "express";
import * as controller from "./challenge.controller";

import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const challengeRouter = express.Router();

challengeRouter
  .use(authentication)
  .use(oldRoute)
  .get("/challenges/", controller.getChallenges)
  .get("/challenges/:challengeId", controller.getChallenge)
  .get("/challenges/:challengeId/solution", controller.getChallengeSolutions)
  .post("/challenges", controller.createChallenge)
  .patch("/challenges/:challengeId", controller.updateChallenge)
  .delete("/challenges/:challengeId", controller.deleteChallenge)
  .get("/challenges/:challengeId/comment", controller.getChallengeComments)
  .get(
    "/challenges/:challengeId/comment/resume",
    controller.getChallengeCommentsResume
  )
  .get(
    "/challenges/:challengeId/comment/:commentId",
    controller.getChallengeComment
  )
  .post("/challenges/:challengeId/comment", controller.createChallengeComment)
  .post("/challenges/:challengeId/transition", controller.changeChallengeState)
  .post("/challenges/:challengeId/invitation", controller.createChallengeInvite)
  .get("/challenges/:challengeId/invitation", controller.getChallengeInvites)
  .post(
    "/challenges/:challengeId/invitation/:invitationId/response",
    controller.responseChallengeInvite
  )
  .post(
    "/challenges/:challengeId/invitation/:invitationId/cancel",
    controller.cancelChallengeInvite
  )
  .post("/challenges/:challengeId/author", controller.changeChallengeAuthor);
