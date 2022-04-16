import IntegrantService from "../services/Integrant.service"
import * as _ from 'lodash';
import GroupValidatorService from "../services/GroupValidator.service";
import { GroupValidatorBody, GroupValidatorQueueResponse } from "../controller/group-validator";
import { GroupValidatorI } from "../models/group-validator";
import { nanoid } from "nanoid";
import { IntegrantI } from "../models/integrant";
import { genericGroupValidatorFilter } from "../utils/field-filters/group-validator";
import { genericArrayUserFilter, lightUserFilter } from "../utils/field-filters/user";
import SolutionService from "../services/Solution.service";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { genericArraySolutionsFilter, lightSolutionFilter } from "../utils/field-filters/solution";
import { LightSolutionResponse } from "../controller/solution";
import { SolutionI } from "../models/situation.solutions";
import BaremoService from "../services/Baremo.service";
import { SOLUTION_STATUS } from "../constants";

export interface GroupValidatorResponse {
    group_validator_id: string,
    name: string,
    created: Date,
}

export const newGroupValidator = async (body:GroupValidatorBody)=> {
  return new Promise(async (resolve, reject)=> {
    try{
      /**
             * Create new group validator variable
             */
      const groupValidator: GroupValidatorI = {
        groupValidatorId: nanoid(),
        name: body.name,
        created: new Date(),
      }
      /**
            * Get integrants for new Group Validator
            */
      const integrants: IntegrantI [] = await IntegrantService.getAllIntegrantsListById(body.integrants)

      const groupValidatorDocs = await GroupValidatorService.newGroupValidator(groupValidator)
            
      /**
            * Insert integrants to group validator
            */
      await IntegrantService.insertIntegrantsToGroupValidator(integrants, groupValidatorDocs)            

      const resp = genericGroupValidatorFilter(groupValidatorDocs)
      return resolve(resp)
    }catch(error){
      return reject(error)
    }
  })
}

/**
 * @TODO create dictionary type or similar for this response
 * @returns 
 */
export const getAllGroupValidatorsDetails = async(): Promise<any> => {
  return new Promise(async (resolve, reject)=> {
    const groupValidators : IntegrantI[] = await IntegrantService.getAllActiveMembers()

    const grouping = groupValidators.reduce((groupingGV, item): any => {
      if(item.groupValidator){
        const groupValidatorId = item.groupValidator.groupValidatorId
        const groupDetails = {"name": item.groupValidator.name, "created": item.groupValidator.created}
        groupingGV[groupValidatorId] = groupingGV[groupValidatorId] || {"details": groupDetails, "integrants": []}
        const user = lightUserFilter(item.user)
        groupingGV[groupValidatorId].integrants.push(user)     
      }
      return groupingGV
    }, {})
    return resolve(grouping)
  })
}
/**
 * Get Ideas for give a resolution. The idea status must be READY_FOR_ANALYSIS or ANALYZING.
 * For each case it is necessary to know:
 * - READY_FOR_ANALYSIS: teams_members that opened the idea for analysis
 * - ANALYZING: teams_members who already confirmed the final analysis
 * @param query 
 * @param groupValidator 
 * @returns 
 */
export const getSolutionsLinked = async (query: any, groupValidator: GroupValidatorI): Promise<GroupValidatorQueueResponse> => {
  try{
    /**
     * Get solutions ready for analysis
     */
    const solutions = await SolutionService.listSolutions(query,{groupValidator})
    const resp: Array<LightSolutionResponse> = await genericArraySolutionsFilter(solutions)
    /**
     * Query for get TeamMembers of GroupValidator
     */
    const teamMembers = await IntegrantService.getIntegrantsOfGroupValidator(groupValidator)
    const usersTeamMembers = await genericArrayUserFilter(teamMembers.map(item => item.user))
    const queue = {
      group_validator_id : groupValidator.groupValidatorId,
      group_validator_name : groupValidator.name,
      step : query.status,
      integrants : usersTeamMembers,
      queue: undefined
    }
    if(query.status == SOLUTION_STATUS.READY_FOR_ANALYSIS){
      queue.queue = resp
      return queue
    } else if(query.status == SOLUTION_STATUS.ANALYZING){
    
      /**
      * For each solution, get baremos started
      */
      const baremosPromises = solutions.map(solution => BaremoService.getAllBaremosBySolution(solution))
      const baremos = await Promise.all(baremosPromises)

      /**
      * Compare baremos opened for validator team members. 
      */
      const chis = resp.map(idea => {
        /**
         * Foreach idea get baremos relationated (from baremos array)
         */
        const baremosForIdea = baremos
          .filter(baremo => baremo[0]?.solution?.solutionId == idea.solution_id)
         
        const usersWithBaremo = baremosForIdea[0]?.map(baremo => {return baremo.user.userId}) || []
 
        const calification = usersTeamMembers.map(user => {
          if(usersWithBaremo.includes(user.user_id)){
            return {validator: user, done: true}
          }else {
            return {validator: user, done: false}
          }
        })
       
        return ({
          ...idea,
          baremos: calification
        })
      })

      queue.queue = chis
      return queue
    }
  } catch(error){
    return Promise.reject(error)
  }
}