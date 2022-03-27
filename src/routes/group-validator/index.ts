import { NextFunction } from "express";
import { body, validationResult, query} from "express-validator";
import { ERRORS, RULES, SOLUTION_STATUS } from "../../constants";
import GroupValidatorController from "../../controller/group-validator";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { IntegrantI } from "../../models/integrant";
import GroupValidatorService from "../../services/GroupValidator.service";
import IntegrantService from "../../services/Integrant.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import * as _ from 'lodash';
import authentication from "../../middlewares/authentication";
import { formatSolutionQuery, QuerySolutionForm } from "../../utils/params-query/solution.query.params";
import { acl } from "../../middlewares/acl";

const router = require("express").Router();

router.post('/group-validator',[
  authentication,
  body("name", "name can not be empty").notEmpty(),
  body("name","group validator name already exist").custom(async (value, {req}): Promise<void> => {
    return new Promise(async (resolve, reject)=> {
      const groupValidators = await GroupValidatorService.getAllGroupValidators();
      groupValidators.forEach(groupValidator => {
        if(groupValidator.name === value){
          return reject()
        }
      })
      return resolve()
    })
  }),
  body("integrants").custom(async (value, {req}): Promise<void> => {
    return new Promise(async (resolve, reject)=> {

      /**
             * Check that array of integrants is valid
             */
      if (!_.isArray(value) || value.length === 0) {
        return reject(ERRORS.ROUTING.INTEGRANTS_MUST_BE_AN_ARRAY)
      }
      const integrants = await IntegrantService.getAllIntegrantsListById(value)
      /**
                 * Check that integrants does not have group validator
                 */
      integrants.forEach(async (integrant:IntegrantI)=> {
        if(integrant.groupValidator){
          return reject(ERRORS.ROUTING.ONE_OR_MORE_INTEGRANT_IS_ALREADY_IN_GROUP_VALIDATOR)
        }
      })

      /**
                 * Check that all integrants are available
                 */
      if (integrants.length !== value.length) {
        return reject(ERRORS.ROUTING.ONE_OR_MORE_INTEGRANT_DOES_NOT_EXIST)    
      }
      return resolve()
    })
  })
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.GROUP_VALIDATOR_POST)

    const groupValidatorController = new GroupValidatorController()
    const committe = await groupValidatorController.newGroupValidator(req.body)
    res
      .json(committe)
      .send()
  }catch(error){
    next(error)
  }
})

router.get('/group-validator',[
  authentication
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> { 
  try{
    const groupValidatorController = new GroupValidatorController()
    const groupValidators = await groupValidatorController.getAllGroupValidatorsDetails()
    res
      .json(groupValidators)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})


router.get('/group-validator/solution',[
  authentication,
  acl(RULES.IS_PART_OF_GROUP_VALIDATOR),
  query('status').isIn([SOLUTION_STATUS.READY_FOR_ANALYSIS,SOLUTION_STATUS.ANALYZING])
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
  try{
    await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.GROUP_VALIDATOR_IDEAS_QUEUE)

    const groupValidatorController = new GroupValidatorController()

    const query: QuerySolutionForm = await formatSolutionQuery(req.query)

    const solutions = await groupValidatorController.getSolutionsLinked(query, req.utils.groupValidator, req.user)

    res
      .json(solutions)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})
const groupValidatorRouter = router

export default groupValidatorRouter