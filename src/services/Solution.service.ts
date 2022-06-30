import Solution, { SolutionI } from "../models/situation.solutions"
import { ChallengeI } from "../models/situation.challenges";
import * as _ from 'lodash'; 
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { UserI } from "../models/users";
import { AreaI } from "../models/organization.area";
import { NewSolutionI } from "../repository/repository.solution";

export interface SolutionEditablesFields {
  title?: string,
  description?: string,
  images?: Array<string>,
  departmentAffected?:Array<AreaI>,
  status?: string,
  startAnalysis?: Date,
  isPrivated?:boolean,
  WSALevelChosed?: string
}

const SolutionService = {
  async getSolutionActiveById (id: string): Promise <any> {
    try{
      const solution = await Solution.findOne({
        solutionId: id,
        active: true,
      })
        .populate('departmentAffected')
        .populate('updatedBy')
        .populate('challenge')
        .populate('author')
        .populate('coauthor')
        .populate('team')
        .populate('insertedBy')
        .populate('areasAvailable')
        .populate('groupValidator')
        .populate('tags')
      return solution
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.SOLUTION_DOES_NOT_EXIST,
        HTTP_RESPONSE._404,
        error))
    }
  },
  async deactivateSolution (solution: any, update: any): Promise<boolean> {
    try{
      await Solution.findOneAndUpdate({
        ...solution
      },{
        ...update
      })
      return true
    }catch(error){
      return error
    }
  },
  async newSolution  (data: NewSolutionI): Promise<any> {
    try{
      const solution = 
      await Solution.create(data)
      const resp = solution.populate('challenge')

      return resp
    }catch (error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.NEW_SOLUTION,
        HTTP_RESPONSE._500,
        error))
    }
  },
  async updateSolutionPartially (solution: SolutionI, data: SolutionEditablesFields): Promise<any> {
    try{
      const resp = await Solution.findOneAndUpdate({
        solutionId: solution.solutionId
      },{
        ...data
      },{ 
        new: true
      })
        .populate('departmentAffected')
        .populate('updatedBy')
        .populate('challenge')
        .populate('author')
        .populate('coauthor')
        .populate('team')
        .populate('insertedBy')
        .populate('areasAvailable')
        .populate('tags')
        
      return resp
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.UPDATE_SOLUTION,
        HTTP_RESPONSE._500,
        error))
    }
  },
  /**
     * Solution List. Is used for solution without challenge associated too.
     * @param query 
     * @param challengeId 
     * @returns 
     */
  async listSolutions(query: QuerySolutionForm, utils: any): Promise<any>{    
    try{
      const mongooseQuery = {..._.pickBy({
        created: query.created,
        active:true,
        title:{
          $regex : `.*${query.title}.*`, 
        },
        status: query.status,
        challengeId: query.challengeId,
      }, _.identity),
      }
      if(utils.groupValidator){
        mongooseQuery.groupValidator = utils.groupValidator
      }  

      const solutions = await Solution
        .find({...mongooseQuery})
        .skip(query.init)
        .limit(query.offset)
        /**
          * Filter order criteria unused
          */
        .sort(_.pickBy(query.sort,_.identity))
        .populate('team')
        .populate('insertedBy')
        .populate('areasAvailable')
        .populate('author')
        .populate('coauthor')
        .populate('groupValidator')
        .populate('challenge')
      return solutions
    }catch(error){
      return Promise.reject( new ServiceError(
        ERRORS.SERVICE.GET_CHALLENGES_SOLUTIONS,
        HTTP_RESPONSE._500,
        error
      ))
    }   
  },
  async getParticipations(user: UserI): Promise<any>{
    try{
      const solutions = await Solution.find({
        $and:[
          {
            active:true
          },
          {
            $or:[
              {
                insertedBy: user
              },
              {
                author: user
              },
              {
                coauthor:{$in: user}
              },
            ]
          }
        ],
      })
        .populate('insertedBy')
        .populate('areasAvailable')
        .populate('author')
        .populate('coauthor')
        .populate('team')
        .populate('challenge')

      return solutions
    }catch(error){
      return Promise.reject( new ServiceError(
        ERRORS.SERVICE.SOLUTION_USER_PARTICIPATIONS,
        HTTP_RESPONSE._500,
        error
      ))
    }
  }    
}
export default SolutionService;