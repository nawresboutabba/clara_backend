//import Solution, { SolutionI } from "../models/solutions";
import Solution, { SolutionI } from "../models/situation.solutions"
import { ChallengeI } from "../models/situation.challenges";
import { startSession } from 'mongoose';
import HistoricalSolution from "../models/historical-solutions";
import * as _ from 'lodash'; 
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

export type editOneParams = {
    description?: string,
    images?: Array<string>,
    canChooseScope?:boolean,
    isPrivate?:boolean,
    status?: string,
    timeInPark?: number,
    baremoValidator?: Array<String>,
    baremoReferrer?: String,
    fileName?: String
    WSALevel?: string
}

const SolutionService = {
    async getSolutionActiveById (id: String): Promise <any> {
        return new Promise((resolve, reject) =>
          Solution.findOne({
            solutionId: id,
            active: true,
          })
          .populate('challenge')
            .then((result) => {
              return resolve(result);
            })
            .catch((err) => {
              return reject(err);
            })
        );
      },
    async deactivateSolution (id: String): Promise<boolean> {
        
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
      async updateWithLog (solutionId: string, solutionChanges: editOneParams): Promise<SolutionI> {
        return new Promise(async (resolve, reject)=> {
          const session = await startSession();
          try {
            const solution = await this.getSolutionActiveById(solutionId)
            const oldData = _.omit(solution.toJSON(), ["_id", "__v"])
            Object.assign(solution, solutionChanges);
  
            session.startTransaction();
            await Promise.all([
              HistoricalSolution.create([oldData], { session: session }),
              solution.save({ session: session }),
            ]);
            await session.commitTransaction();
            session.endSession();
  
            return resolve(solution);
          } catch (error) {
            await session.abortTransaction();
            session.endSession();
            const customError = new ServiceError(
              ERRORS.SERVICE.DELETE_USER, 
              HTTP_RESPONSE._500,
              error)            
            return reject(customError);
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
    async listSolutionsChallenge (challengeId: string, init:number, offset: number ): Promise<any[]>{
      const solutions = await Solution
      .find({challengeId: challengeId, active: true})
      .skip(init).limit(offset)
      return solutions
    }    
}
export default SolutionService;