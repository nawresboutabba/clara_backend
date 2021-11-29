import Solution, { TYPE_SOLUTION } from "../models/solutions";
import { startSession } from 'mongoose';
import HistoricalSolution from "../models/historical-solutions";
import * as _ from 'lodash'; 

type editOneParams = {
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
    async getSolutionActiveById (id: String): Promise <TYPE_SOLUTION> {
        return new Promise((resolve, reject) =>
          Solution.findOne({
            solutionId: id,
            active: true,
          })
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
      async updateWithLog (solutionId: string, solutionChanges: editOneParams): Promise<TYPE_SOLUTION> {
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
      async newSolution  (data: TYPE_SOLUTION): Promise<TYPE_SOLUTION> {
        // Check that solution exist
        return new Promise((resolve, reject) => {
          Solution.create(data)
            .then((resp) => {
              resolve(resp);
            })
            .catch((err) => {
              reject(err);
            });
        })
    },  
}
export default SolutionService;