import * as express from "express";
import {
  createChallengeController,
  getChallengeController,
  getChallengesController,
  getChallengeSolutionsController,
  updateChallengeController,
  deleteChallengeController,
} from "../../controller/challenge/challenge.controller";
import authentication from "../../middlewares/authentication";
import oldRoute from "./index";

export const challengeRouter = express.Router();

challengeRouter
  .use(authentication)
  .use(oldRoute)
  .get("/challenge/", getChallengesController)
  .get("/challenge/:challengeId", getChallengeController)
  .get("/challenge/:challengeId/solution", getChallengeSolutionsController)
  .post("/challenge", createChallengeController)
  .patch("/challenge/:challengeId", updateChallengeController)
  .delete("/challenge/:challengeId", deleteChallengeController)
  .post("/challenge/:challengeId/comment")
  .post("/challenge/:challengeId/transition")
  .post("/challenge/:challengeId/invitation/:invitationId/response")
  .post("/challenge/:challengeId/invitation");
