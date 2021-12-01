import { TYPE_SOLUTION } from "../models/solutions";
import { SolutionBody, UserRequest } from "../controller/solution";
import SolutionService from "../services/Solution.service";
import { SOLUTION, SOLUTION_STATUS } from '../constants'
import { nanoid } from 'nanoid'
import * as _ from 'lodash';

export const newSolution = async (body:SolutionBody,  user: UserRequest, challengeId?: string):Promise<TYPE_SOLUTION> => {
    return new Promise (async (resolve, reject)=> {
        try {
          //@TODO check that challenge exist

          //@TODO have to use lodash for convert to cameCase
            const created = new Date();
            const {
              description,
              file_name: fileName,
              images,
              is_private: isPrivate,
            } = body;

            let data: TYPE_SOLUTION
            data = {
              solutionId: nanoid(),
              authorEmail: user.email,
              created: created,
              updated: created,
              canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
              status: SOLUTION_STATUS.LAUNCHED,
              timeInPark: SOLUTION.TIME_IN_PARK,
              isPrivate:false,
              active: true,
              description,
              fileName: "URL1",
              images: ["URL1","URL2"],
            }
            if (challengeId){
              data.challengeId =challengeId
            }
            const solution = await SolutionService.newSolution(data);          
            return resolve(solution)  
        }catch (error) {
            return reject ("ERROR_INSERT_NEW_SOLUTION")
        }
    }) 
}

export const updateSolutionPartially = async (body: SolutionBody, solutionId: string ): Promise<TYPE_SOLUTION> =>  {
  return new Promise (async (resolve, reject)=> {
    try{
      const solutionChanges = _.mapKeys(body, (v: any, k:any) => _.camelCase(k));
      const solution = await SolutionService.updateWithLog(solutionId, solutionChanges);
      return resolve(solution)
    }catch (error){
      return reject(error)
    }
  })
}

export const deleteSolution = async (solutionId: string): Promise<boolean> => {
  return new Promise (async (resolve, reject)=> {
    try {
      await SolutionService.deactivateSolution(solutionId);
      return resolve(true)
    }catch (error){
      return reject("ERROR_ELIMINAR_SOLUTION")
    }
  })
}

export const getSolution = (solutionId: string, solution: TYPE_SOLUTION): Promise <TYPE_SOLUTION>=> {
  return new Promise ((resolve, reject)=> {
    return resolve(solution)
  })
}