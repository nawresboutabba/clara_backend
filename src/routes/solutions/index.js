"use strict";

const router = require("express").Router();
const Solution = require("@models/solutions");
const { nanoid } = require("nanoid");
const {
  SOLUTION,
  SOLUTION_STATUS,
  HTTP_RESPONSE,
} = require("@root/src/constants");
const _ = require("lodash");
const {
  validationResult,
  body,
} = require("express-validator");
const checkResourceExistFromParams = require("@middlewares/check-resources-exist");
const authentication = require("@middlewares/authentication");

router.post(
  "/solution",
  [
    body("description", "description can not be empty").notEmpty(),
    authentication,
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const created = new Date();
      const {
        // It can be null if it does not have an associated problem
        id_challenge: idChallenge,
        description,
        file_name: fileName,
        images,
        is_private: isPrivate,
      } = req.body;
      const solution = await Solution.newSolution({
        // @TODO automatic Id
        solutionId: nanoid(),
        // calculated trough session
        authorEmail: req.user.email,
        created: created,
        updated: created,
        canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
        status: SOLUTION_STATUS.LAUNCHED,
        timeInPark: SOLUTION.TIME_IN_PARK,
        idChallenge,
        description,
        fileName,
        images,
        isPrivate,
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
  [checkResourceExistFromParams("solutions"), authentication],
  async (req, res, next) => {
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
  [checkResourceExistFromParams("solutions"), authentication],
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const solutionChanges = _.mapKeys(req.body, (v, k) => _.camelCase(k));
      const solutionId = req.params.solutionId;

      const solutionInstance = await Solution.getSolutionActiveById(solutionId);
      const resp = await solutionInstance.updateWithLog(solutionChanges);
      if (resp instanceof Error) {
        throw resp;
      }
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
  [checkResourceExistFromParams("solutions"), authentication],
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }

      const solutionId = req.params.solutionId;
      const solutionInstance = await Solution.getSolutionActiveById(solutionId);
      await solutionInstance.deactivateSolution();

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);
module.exports = router;
