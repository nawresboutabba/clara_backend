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
  .post("/challenge/:challengeId/comment", controller.createChallengeComment)
  .post("/challenge/:challengeId/invitation/:invitationId/response")
  .post("/challenge/:challengeId/invitation")
  .post("/challenge/:challengeId/transition")
