import { NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import { ERRORS, RULES } from "../../constants";
import IntegrantController from "../../controller/integrant";
import { acl } from "../../middlewares/acl";
import authentication from "../../middlewares/authentication";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import IntegrantService from "../../services/Integrant.service";
import UserService from "../../services/User.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";

const router = require("express").Router();

router.get('/integrant/general', [
  authentication,
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const integrantController = new IntegrantController()
    const generalMember = await integrantController.getGeneralMembers()
    res
      .json(generalMember)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post('/integrant/general', [
  authentication,
  acl(
    RULES.IS_LEADER
  ),
  check('userId', "user does not exist").custom(async (value, { req }): Promise<void> => {
    try {
      const user = await UserService.getUserActiveByUserId(value)
      if (!user) {
        return Promise.reject()
      }
      req.utils = { ...req.utils, user }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }),
  body('functions_description', "functions_description is required").not().isEmpty(),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.SIGNUP_USER)
    const integrantController = new IntegrantController()
    const integrant = await integrantController.newIntegrant({ user: req.utils.user.userId, functionsDescription: req.body.functions_description }, req.utils.user)
    res
      .json(integrant)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.post('/integrant/leader/:integrantId', [
  authentication,
  acl(
    RULES.IS_ADMIN
  ),
  check('integrantId', "integrant does not exist").custom(async (value): Promise<void> => {
    const check = await IntegrantService.checkIntegrantStatus(value)
    if (check.exist && check.isActive) {
      return Promise.resolve()
    }
    return Promise.reject()
  }),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.SIGNUP_USER)

    const integrantController = new IntegrantController()
    const integrant = await integrantController.newLeader(req.params.integrantId)
    res
      .json(integrant)
      .send()
  } catch (error) {
    next(error)
  }
})


router.delete('/integrant/general/:integrantId', [
  authentication,
  acl(
    RULES.IS_LEADER
  ),
  check('integrantId', "integrant does not exist").custom(async (value, { req }): Promise<void> => {
    const check = await IntegrantService.checkIntegrantStatus(value)
    if (check.exist && check.isActive) {
      return Promise.resolve()
    }
    return Promise.reject()
  }),
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const integrantController = new IntegrantController()
    const integrant = await integrantController.deleteGeneralMember(req.params.integrantId)
    res
      .json(integrant)
      .send()
  } catch (error) {
    next(error)
  }
})
const integrantRouter = router

export default integrantRouter