"use strict";
import * as express from "express";
const router = express.Router();
import SolutionService from "../../services/Solution.service";
import authentication from "../../middlewares/authentication";
import * as _ from 'lodash'; 
import { nanoid } from 'nanoid'
import { NextFunction} from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import {
  SOLUTION, SOLUTION_STATUS
} from '../../constants'

import { validationResult, body } from "express-validator";
import checkResourceExistFromParams from '../../middlewares/check-resources-exist';

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
      const created = new Date();
      const {
        // It can be null if it does not have an associated problem
        description,
        file_name: fileName,
        images,
        is_private: isPrivate,
      } = req.body;
      const solution = await SolutionService.newSolution({
        // @TODO automatic Id
        solutionId: nanoid(),
        // calculated trough session
        authorEmail: req.user.email,
        created: created,
        updated: created,
        canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
        status: SOLUTION_STATUS.LAUNCHED,
        timeInPark: SOLUTION.TIME_IN_PARK,
        isPrivate:false,
        active: true,
        description,
        fileName: "URL1",
        images: ["URL1","URL2"],
      });
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
      res.status(200).json(req.resources.solution).send();
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
      const solutionChanges = _.mapKeys(req.body, (v: any, k:any) => _.camelCase(k));
      const solutionId = req.params.solutionId;
      const resp = await SolutionService.updateWithLog(solutionId, solutionChanges);
      res.status(200).json(resp).send();
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

      const solutionId = req.params.solutionId;
      await SolutionService.deactivateSolution(solutionId);

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);
const solutionsRouter = router
export default solutionsRouter;
