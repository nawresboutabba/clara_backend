import { SolutionI } from "../models/situation.solutions";
import { ChallengeI } from '../models/situation.challenges';
import { SolutionBody, SolutionResponse } from "../controller/solution";
import { UserRequest } from "../controller/users";
import SolutionService from "../services/Solution.service";
import ChallengeService from "../services/Challenge.service";
import { ERRORS, HTTP_RESPONSE, SOLUTION, SOLUTION_STATUS } from '../constants'
import { nanoid } from 'nanoid'
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericArraySolutionsFilter, genericSolutionFilter } from "../utils/field-filters/solution";
import TeamService from "../services/Team.service";
import RepositoryError from "../handle-error/error.repository";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";

export const newSolution = async (body:SolutionBody,  user: UserRequest, challengeId?: string):Promise<SolutionResponse> => {
    return new Promise (async (resolve, reject)=> {
        try {
          const insertedBy = await UserService.getUserActiveByUserId(user.userId)
          /**
           * Solution have to have setted `author` or `team`.
           * If both are undefined or null, then throw error
           */
          const author = await UserService.getUserActiveByUserId(body.author)
          const team = await TeamService.getTeamById(body.team)
          if(!(author || team )){
            throw new RepositoryError(
              ERRORS.REPOSITORY.TEAM_AND_AUTHOR_NOT_EXIST,
              HTTP_RESPONSE._404
            )
          }
            const created = new Date();
            const {
              description,
              file_complementary: fileComplementary,
              images,
              is_private: isPrivate,
              title,
              WSALevel
            } = body;

            let data: SolutionI
            data = {
              insertedBy,
              solutionId: nanoid(),
              title: title,
              author,
              team,
              created: created,
              updated: created,
              canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
              status: SOLUTION_STATUS.LAUNCHED,
              timeInPark: SOLUTION.TIME_IN_PARK,
              isPrivate:false,
              active: true,
              description,
              fileComplementary: fileComplementary,
              images: images,
              WSALevel,
            }
            let challenge: ChallengeI
            if (challengeId){
              data.challengeId =challengeId
              challenge = await ChallengeService.getChallengeActiveById(challengeId)
            }
            const solution = await SolutionService.newSolution(data, challenge);          
            const resp = genericSolutionFilter(solution)
            return resolve(resp)  
        }catch (error) {
            return reject (error)
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
      /**
       * @TODO set error
       */
      return reject("ERROR_ELIMINAR_SOLUTION")
    }
  })
}

export const getSolution = (solutionId: string, solution: SolutionI): Promise <SolutionResponse>=> {
  return new Promise (async (resolve, reject)=> {
    const resp = genericSolutionFilter(solution)
    return resolve(resp)
  })
}

export const listSolutions = async (query: QuerySolutionForm,challengeId?: string ): Promise<SolutionResponse []> => {
  return new Promise (async (resolve, reject)=> {
    try {
      const listSolutions = await SolutionService.listSolutions(query, challengeId)
      const resp = genericArraySolutionsFilter(listSolutions)
      return resolve(resp)
    }catch (error){
      return reject(error)
    }
  })
}
