const router = require("express").Router();
const Challenge = require("@models/challenges");
const Solution = require("@models/solutions");
const _ = require("lodash");
const { nanoid } = require("nanoid");
const authentication = require("@middlewares/authentication");
const checkResourceExistFromParams = require("@middlewares/check-resources-exist");
const { validationResult, body } = require("express-validator");
const {
  SOLUTION,
  SOLUTION_STATUS,
  HTTP_RESPONSE,
} = require("@root/src/constants");

router.post(
  "/challenge",
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
        description,
        images,
        time_period: timePeriod,
        validators,
        referrer,
        work_space_available: workSpaceAvailable,
      } = req.body;
      const challenge = await Challenge.newChallenge({
        challengeId: nanoid(),
        created,
        description,
        status: "LAUNCHED",
        images,
        timePeriod,
        validators,
        referrer,
        workSpaceAvailable,
      });
      res.status(200).json(challenge).send();
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
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const created = new Date();
      const challengeId = req.resources.challenge.challengeId;
      const {
        description,
        file_name: fileName,
        images,
        is_private: isPrivate,
      } = req.body;
      const solution = await Solution.newSolution({
        // @TODO automatic Id
        challengeId: challengeId,
        solutionId: nanoid(),
        // calculated trough session
        authorEmail: "hardcode@gmail.com",
        created: created,
        updated: created,
        canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
        status: SOLUTION_STATUS.LAUNCHED,
        description,
        fileName,
        images,
        isPrivate,
      });
      res.status(200).json(solution).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  `/challenge/:challengeId`,
  [checkResourceExistFromParams(`challenges`), authentication],
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      res.status(200).json(req.resources.challenge).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/challenge/:challengeId",
  [checkResourceExistFromParams("challenges"), authentication],
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }
      const challengeChanges = _.mapKeys(req.body, (v, k) => _.camelCase(k));
      const challengeId = req.params.challengeId;

      const challengeInstance = await Challenge.getChallengeActiveById(
        challengeId
      );

      const resp = await challengeInstance.updateWithLog(challengeChanges);
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
  "/challenge/:challengeId",
  [checkResourceExistFromParams("challenges"), authentication],
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();

      if (errors.length > 0) {
        res.status(400);
        throw new Error(JSON.stringify(errors));
      }

      const challengeId = req.params.challengeId;
      const challengeInstance = await Challenge.getChallengeActiveById(
        challengeId
      );
      await challengeInstance.deactivateChallenge();

      res.status(204).send();
      next();
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
