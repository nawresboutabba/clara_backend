import * as express from "express";
import * as controller from './challenge.controller'

import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const challengeRouter = express.Router();

challengeRouter
  .use(authentication)
  .use(oldRoute)
  .get("/challenge/", controller.getChallenges)
  .get("/challenge/:challengeId", controller.getChallenge)
  .get("/challenge/:challengeId/solution", controller.getChallengeSolutions)
  .post("/challenge", controller.createChallenge)
  .patch("/challenge/:challengeId", controller.updateChallenge)
  .delete("/challenge/:challengeId", controller.deleteChallenge)
  .get("/challenge/:challengeId/comment", controller.getChallengeComments)
  .get("/challenge/:challengeId/comment/resume", controller.getChallengeCommentsResume)
  .get("/challenge/:challengeId/comment/:commentId", controller.getChallengeComment)
  .post("/challenge/:challengeId/comment", controller.createChallengeComment)
  .post("/challenge/:challengeId/transition")
  .post("/challenge/:challengeId/invitation", controller.createChallengeInvite)
  .get("/challenge/:challengeId/invitation", controller.getChallengeInvites)
  .post("/challenge/:challengeId/invitation/:invitationId/response", controller.responseChallengeInvite)
  .post("/challenge/:challengeId/invitation/:invitationId/cancel", controller.cancelChallengeInvite)
  .post("/challenge/:challengeId/author", controller.changeChallengeAuthor)
  
