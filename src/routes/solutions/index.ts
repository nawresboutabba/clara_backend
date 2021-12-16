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
import RoutingError from "../../handle-error/error.routing";
import { ERRORS, HTTP_RESPONSE } from "../../constants";


router.post(
  "/solution",
  [
    body("description", "description can not be empty").notEmpty(),
    body("title", "title can not be empty").notEmpty(),
    authentication,
  ],
  async (req: RequestMiddleware, res: ResponseMiddleware, next:NextFunction) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        const customError = new RoutingError(
          ERRORS.ROUTING.SIGNUP_USER,
          HTTP_RESPONSE._400,
          errors
          )
        throw customError;
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
  // @TODO patch control: Something have to be editable
  [checkResourceExistFromParams("solutions"), 
  authentication
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
      const solutionController = new SolutionController()
      const solution = await solutionController.updateSolutionPartially(req.body, req.params.solutionId)
      res.status(200).json(solution).send();
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/solution/:solutionId",
  /**
   * @TODO Check that the user can delete the solution
   */
  [checkResourceExistFromParams("solutions"),
  authentication
],
  async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
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
