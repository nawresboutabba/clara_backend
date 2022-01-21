import { SolutionI } from "../models/situation.solutions";
import { ChallengeI } from '../models/situation.challenges';
import { SolutionBody, SolutionResponse } from "../controller/solution";
import { UserRequest } from "../controller/users";
import SolutionService from "../services/Solution.service";
import ChallengeService from "../services/Challenge.service";
import { PARTICIPATION_MODE, SOLUTION, SOLUTION_STATUS, WSALEVEL } from '../constants'
import { nanoid } from 'nanoid'
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericArraySolutionsFilter, genericSolutionFilter } from "../utils/field-filters/solution";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import AreaService from "../services/Area.service";
import { AreaI } from "../models/organization.area";
import { newTeam } from "./repository.team"
import { TeamI } from "../models/team";
import { generateSolutionCoauthorshipInvitation, generateSolutionTeamInvitation } from "./repository.invitation";

export const newSolution = async (body:SolutionBody,  user: UserRequest, challengeId?: string):Promise<SolutionResponse> => {
    return new Promise (async (resolve, reject)=> {
        try {
          const guests = await UserService.getUsersById(body.participation.guest)
          const insertedBy = await UserService.getUserActiveByUserId(user.userId)
          /**
           * Solution have to have setted `author` or `team`.
           * If both are undefined or null, then throw error
           */
          const creator = await UserService.getUserActiveByUserId(body.participation.creator)

          const created = new Date();
          const {
            description,
            file_complementary: fileComplementary,
            images,
            is_private: isPrivate,
            title,
            WSALevel,
            areas_available
          } = body;
          let areasAvailable: Array<AreaI>

          if (WSALevel == WSALEVEL.AREA){
             areasAvailable = await AreaService.getAreasById(areas_available)
          }
          let data: SolutionI
          data = {
            insertedBy,
            solutionId: nanoid(),
            title: title,
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
            areasAvailable,
            participationModeChosen: body.participation.chosen_mode,
            filterReactionFilter: false,
            filterMinimunLikes: 0,
            filterMaximunDontUnderstand:1000,
            communityCanSeeReactions: true,
            filterCanShowDisagreement: true,
            filterCanFixDesapprovedIdea: true,
            timeExpertFeedback: 3000,
            timeIdeaFix:3000
          }

          let challenge: ChallengeI
          if (challengeId){
            data.challengeId =challengeId
            challenge = await ChallengeService.getChallengeActiveById(challengeId)
            data.challenge = challenge
          }
          
          /**
           * Participation Mode Choosed
           */
          if (body.participation.chosen_mode == PARTICIPATION_MODE.TEAM){
            const team : TeamI  = await newTeam(creator, body.participation.team_name)
            data.team = team
          }else if (body.participation.chosen_mode == PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
            data.author = creator
            data.coauthor = guests
          }

            const solution = await SolutionService.newSolution(data, challenge);   
            /**
             * Create invitations
             */
            if (body.participation.chosen_mode = PARTICIPATION_MODE.TEAM){
              generateSolutionTeamInvitation(creator, guests, solution, solution.team)
            }else if (body.participation.chosen_mode = PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
              generateSolutionCoauthorshipInvitation(creator, guests, solution)
            }

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
      /**
       * @TODO list solutions filter with minimal data
       */
      const resp = await genericArraySolutionsFilter(listSolutions)
      return resolve(resp)
    }catch (error){
      return reject(error)
    }
  })
}
