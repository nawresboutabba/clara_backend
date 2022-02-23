//import Solution, { SolutionI } from "../models/solutions";
import Solution, { SolutionI } from "../models/situation.solutions"
import { ChallengeI } from "../models/situation.challenges";
import * as _ from 'lodash'; 
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { UserI } from "../models/users";
import { TeamI } from "../models/team";
import { AreaI } from "../models/organization.area";

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
    return new Promise(async (resolve, reject) =>
      await Solution.findOne({
        solutionId: id,
        active: true,
      })
        .populate('challenge')
        .populate('author')
        .then((result) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        })
    );
  },
  async deactivateSolution (id: string): Promise<boolean> {
        
    const solution = await this.getSolutionActiveById(id)
    try{
      solution.updated = new Date()
      solution.active = false;
      await solution.save()
      return true
    }catch(error){
      return error
    }
  },
  async updateWithLog (solutionId: string, solutionChanges: editOneParams): Promise<any> {
    return new Promise(async (resolve, reject)=> {
      try {
        const solution = await Solution.findOneAndUpdate({
          solutionId: solutionId,
          active: true,
        }, 
                                                         {
                                                           ...solutionChanges
                                                         }, 
                                                         {
                                                           new: true
                                                         })
          .populate('team')
          .populate('insertedBy')
          .populate('areasAvailable')
          .populate('author')
          .populate('coauthor')
        return resolve(solution);
      } catch (error) {          
        return reject( new ServiceError(
          ERRORS.SERVICE.DELETE_USER, 
          HTTP_RESPONSE._500,
          error)   
        );
      }
    })
  },
  async newSolution  (data: SolutionI, challenge?: ChallengeI): Promise<any> {
    // Check that solution exist
    return new Promise(async (resolve, reject) => {
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
        await Solution.create(data)
          .then((resp) => {
            return resolve(resp);
          })
          .catch((err) => {
            const customError = new ServiceError(
              ERRORS.SERVICE.NEW_SOLUTION,
              HTTP_RESPONSE._500,
              err)
            return reject(customError);
          });
      }catch (error){
        return resolve(error)
      }
    })
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