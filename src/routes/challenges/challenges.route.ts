import * as express from "express";
import { challengesController as controller } from "../../controller/challenge/challenges.controller";

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
  .post("/challenge/:challengeId/comment")
  .post("/challenge/:challengeId/transition")
  .post("/challenge/:challengeId/invitation/:invitationId/response")
  .post("/challenge/:challengeId/invitation");
