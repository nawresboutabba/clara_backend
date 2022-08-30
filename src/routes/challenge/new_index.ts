import * as express from "express";
import {
  getChallengeController,
  getChallengesController,
  getChallengeSolutionsController,
} from "../../controller/challenge/challenge.controller";
import authentication from "../../middlewares/authentication";

export const challengeRouter = express.Router();

challengeRouter.use(authentication);

challengeRouter
  .get("/challenge/", getChallengesController)
  .get("/challenge/:challengeId", getChallengeController)
  .get("/challenge/:challengeId/solution", getChallengeSolutionsController);
