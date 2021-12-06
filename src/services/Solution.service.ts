//import Solution, { SolutionI } from "../models/solutions";
import Solution, { SolutionI } from "../models/situation.solutions"
import { ChallengeI } from "../models/situation.challenges";
import { startSession } from 'mongoose';
import HistoricalSolution from "../models/historical-solutions";
import * as _ from 'lodash'; 
import Challenge from '../models/situation.challenges'

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
        const solution = await this.getSolutionActiveById(solutionId)
        const oldData = _.omit(solution.toJSON(), ["_id", "__v"])
        Object.assign(solution, solutionChanges);
        const session = await startSession();
        try {
          session.startTransaction();
          await Promise.all([
            HistoricalSolution.create([oldData], { session: session }),
            solution.save({ session: session }),
          ]);
          await session.commitTransaction();
          session.endSession();

          return solution;
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          return error;
        }
      },
      async newSolution  (data: SolutionI, challenge?: ChallengeI): Promise<any> {
        // Check that solution exist
        return new Promise(async (resolve, reject) => {
          if(data.challengeId){
            data.challenge = challenge
          }
          Solution.create(data)
            .then((resp) => {
              resolve(resp);
            })
            .catch((err) => {
              reject(err);
            });
        })
    },
    async listSolutionsChallenge (challengeId: string ): Promise<any[]>{
      const solutions = await Solution.find({challengeId: challengeId, active: true})
      return solutions
    }    
}
export default SolutionService;