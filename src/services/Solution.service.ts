// import Solution, { SolutionI } from "../models/solutions";
import Solution, { SolutionI } from "../models/situation.solutions"
import { ChallengeI } from "../models/situation.challenges";
import * as _ from 'lodash'; 
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { UserI } from "../models/users";
import { TeamI } from "../models/team";
import { AreaI } from "../models/organization.area";
import { getCurrentDate } from "../utils/date";

export type editOneParams = {
  title: string,
  description?: string,
  images?: Array<string>,
  departmentAffected?:Array<AreaI>,
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
        .populate('updatedBy')
        .populate('challenge')
        .populate('author')
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
  async newSolution  (data: SolutionI, challenge?: ChallengeI): Promise<any> {
    try{
      if(data.challengeId){
        if(!challenge){
          const customError = new ServiceError(
            ERRORS.SERVICE.NEW_SOLUTION,
            HTTP_RESPONSE._500,
          )
          throw customError
        }
        data.challenge = challenge
      }
      const solution = await Solution.create(data)
      return solution
    }catch (error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.NEW_SOLUTION,
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
  async listSolutions(query: QuerySolutionForm ,challengeId: string): Promise<any>{
    return new Promise (async (resolve, reject)=> {
      try{
        const solutions = await Solution
          .find(
            {..._.pickBy({
              created: query.created,
              active:true,
              title:{
                $regex : `.*${query.title}.*`, 
              }
            }, _.identity),
             challengeId
            }
          )
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
        return resolve(solutions)
      }catch(error){
        return reject( new ServiceError(
          ERRORS.SERVICE.GET_CHALLENGES_SOLUTIONS,
          HTTP_RESPONSE._500,
          error
        ))
      }
    })    
  },
  async getParticipations(user: UserI, teams: TeamI []): Promise<any>{
    return new Promise(async (resolve, reject)=> {
      try{
        const solutions = await Solution.find({
          active: true,
          $and:[
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
                {
                  team: {$in: teams}
                }
              ]
            }
          ],
        })
          .populate('insertedBy')
          .populate('areasAvailable')
          .populate('author')
          .populate('coauthor')
          .populate("team")

        return resolve(solutions)
      }catch(error){
        return reject( new ServiceError(
          ERRORS.SERVICE.SOLUTION_USER_PARTICIPATIONS,
          HTTP_RESPONSE._500,
          error
        ))
      }
    })
  }    
}
export default SolutionService;