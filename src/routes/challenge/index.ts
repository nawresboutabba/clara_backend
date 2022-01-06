const router = require("express").Router();

import authentication from "../../middlewares/authentication";
import { NextFunction } from 'express';
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import { RequestMiddleware, ResponseMiddleware } from '../../middlewares/middlewares.interface';
const { validationResult, body,check } = require("express-validator");
import ChallengeController from '../../controller/challenge'
import RoutingError from "../../handle-error/error.routing";
import { ERRORS, HTTP_RESPONSE } from "../../constants";

router.post(
  "/challenge",
  [
    authentication,
    body("description", "description can not be empty").notEmpty(),
    body("title", "title can not be empty").notEmpty(),
    /**
     * participation could be TEAM OR INDIVIDUAL_WITH_COAUTHORSHIP or both
     */
    body("participation_mode").custom((value:Array<string> , {req}): Promise<void>=> {
      return new Promise((resolve, reject)=> {
        value.forEach(element => {
          if (["TEAM", "INDIVIDUAL_WITH_COAUTHORSHIP"].includes(element) == false){
            return reject("participation_mode invalid")
          }
        });
          if(value.length <3){
            return resolve()
          }
          return reject("participation_mode invalid")
      })
    }),
    check("WSALevel", "WSALevel invalid").isIn(['COMPANY', 'AREA']),
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        const customError = new RoutingError(
          ERRORS.ROUTING.PATCH_SOLUTION,
          HTTP_RESPONSE._400,
          errors
          )
        throw customError;
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

router.get('/challenge/:challengeId/solution',
async (req:RequestMiddleware ,res: ResponseMiddleware,next:NextFunction)=> {
  try {
    const challengeController = new ChallengeController();
    const solutions = await challengeController.listSolutions(req.params.challengeId)
    res
    .json(solutions)
    .status(200)
    .send()
  }catch(error){
    next(error)
  }
})
const challengeRouter = router
export default challengeRouter;
