const router = require("express").Router();
const Challenge = require("@models/challenges");
const Solution = require("@models/solutions");
const _ = require("lodash");
const { nanoid } = require("nanoid");
import authentication from "../../middlewares/authentication";
import { NextFunction } from 'express';
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
import ChallengeService from '../../services/Challenge.service';
import SolutionService from '../../services/Solution.service';
const { validationResult, body } = require("express-validator");
const {
  SOLUTION,
  SOLUTION_STATUS,
  HTTP_RESPONSE,
} = require("@root/src/constants");
import ChallengeController from '../../controller/challenge'

router.post(
  "/challenge",
  [
    body("description", "description can not be empty").notEmpty(),
    authentication,
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeController = new ChallengeController();
      const challenge = await challengeController.newChallenge(req.body, req.user)
      res
      .status(200)
      .json(challenge)
      .send();
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/challenge/:challengeId/solution",
  [
    checkResourceExistFromParams(`challenges`),
    body("description", "description can not be empty").notEmpty(),
    authentication,
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeController = new ChallengeController();
      const solution = await challengeController.newSolution(req.body, req.user, req.params.challengeId)
      res
      .status(200)
      .json(solution)
      .send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  `/challenge/:challengeId`,
  [checkResourceExistFromParams(`challenges`), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeController = new ChallengeController();
      const challenge = await challengeController.getChallenge(req.resources.challenge,  req.params.challengeId)
      res.status(200).json(challenge).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/challenge/:challengeId",
  [checkResourceExistFromParams("challenges"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }

      const challengeController = new ChallengeController();
      const challenge = await challengeController.updateChallengePartially(req.body,  req.params.challengeId)

      res
        .status(200)
        .json(challenge)
        .send();
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/challenge/:challengeId",
  [checkResourceExistFromParams("challenges"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeController = new ChallengeController();
      await challengeController.deleteChallenge(req.params.challengeId)
      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

const challengeRouter = router
export default challengeRouter;
