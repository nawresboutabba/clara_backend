import { SolutionI } from "../models/situation.solutions";
import { ChallengeI } from '../models/situation.challenges';
import { SolutionBody } from "../controller/solution";
import { UserRequest } from "../controller/users";
import SolutionService from "../services/Solution.service";
import ChallengeService from "../services/Challenge.service";
import { SOLUTION, SOLUTION_STATUS } from '../constants'
import { nanoid } from 'nanoid'
import * as _ from 'lodash';

export const newSolution = async (body:SolutionBody,  user: UserRequest, challengeId?: string):Promise<SolutionI> => {
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

            let data: SolutionI
            data = {
              solutionId: nanoid(),
              title: "Titulo hardcodeado",
              author: user.email,
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
            let challenge: ChallengeI
            if (challengeId){
              data.challengeId =challengeId
              challenge = await ChallengeService.getChallengeActiveById(challengeId)
            }
            const solution = await SolutionService.newSolution(data, challenge);          
            return resolve(solution)  
        }catch (error) {
            return reject ("ERROR_INSERT_NEW_SOLUTION")
        }
    }) 
}

export const updateSolutionPartially = async (body: SolutionBody, solutionId: string ): Promise<SolutionI> =>  {
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

export const getSolution = (solutionId: string, solution: SolutionI): Promise <SolutionI>=> {
  return new Promise (async (resolve, reject)=> {
    return resolve(solution)
  })
}