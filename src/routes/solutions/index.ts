"use strict";
import * as express from "express";
const router = express.Router();
import authentication from "../../middlewares/authentication";
import * as _ from 'lodash'; 
import { NextFunction} from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { validationResult, body } from "express-validator";
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';
import SolutionController from '../../controller/solution/index'


router.post(
  "/solution",
  [
    body("description", "description can not be empty").notEmpty(),
    authentication,
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const solutionController = new SolutionController()
      const solution = await solutionController.newSolution(req.body, req.user)
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
  "/solution/:solutionId",
  [checkResourceExistFromParams("solutions"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const solutionController = new SolutionController()
      const solution = await solutionController.getSolution(req.params.solutionId,req.resources.solution)
      res.status(200).json(solution).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/solution/:solutionId",
  [checkResourceExistFromParams("solutions"), 
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const solutionController = new SolutionController()
      const solution = await solutionController.updateSolutionPartially(req.body, req.params.solutionId)
      res.status(200).json(solution).send();
      next();
    } catch (error) {
      res.status(500);
      next(error);
    }
  }
);

router.delete(
  "/solution/:solutionId",
  [checkResourceExistFromParams("solutions"),
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const solutionController = new SolutionController()
      await solutionController.deleteSolution(req.params.solutionId)

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);
const solutionsRouter = router
export default solutionsRouter;
