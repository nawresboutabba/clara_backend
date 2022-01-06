import { ChallengeBody, ChallengeResponse } from "../controller/challenge";
import { ChallengeI } from "../models/situation.challenges";
import { SolutionI } from "../models/situation.solutions";
import ChallengeService from "../services/Challenge.service";
import GroupValidatorService from "../services/GroupValidator.service";
import { nanoid } from 'nanoid'
import { UserRequest } from "../controller/users";
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericChallengeFilter } from "../utils/field-filters/challenge";
export const newChallenge = async (body:ChallengeBody, user:UserRequest): Promise<ChallengeResponse> => {
    return new Promise (async (resolve, reject)=> {
        try{
            const created = new Date();
            const {
              title,
              description,
              images,
              WSALevel,
              group_validator,
              is_strategic,
              file_complementary,
              participation_mode
            } = body;

            const author = await UserService.getUserActiveByUserId(user.userId)
 
            const groupValidator = await GroupValidatorService.getGroupValidatorById(group_validator)
   
            const challenge = await ChallengeService.newChallenge({
              author: author, 
              created,
              challengeId: nanoid(),
              title,
              description,
              images,
              WSALevel,
              groupValidator,
              /**
               * @TODO use de machine state
               */
              status: "LAUNCHED",
              active: true, 
              /**
               * Get to global configuration?
               */
              timePeriod: 3000,
              fileComplementary: file_complementary,
              isStrategic: is_strategic,
              participationMode: participation_mode
            });
            const resp = genericChallengeFilter(challenge)
            return resolve(resp)          
        }catch (error){
            return reject(error)
        }
    })
}

export const getChallenge = async (challenge: ChallengeI, challengeId : string ): Promise<ChallengeI> => {
  return new Promise ((resolve, reject)=> {
      return resolve(challenge)
  })
}

export const updateChallengePartially = async (body: ChallengeBody, challengeId: string): Promise<ChallengeI> => {
  return new Promise (async(resolve, reject)=> {
    try{
      const challengeChanges = _.mapKeys(body, (v: any, k:any) => _.camelCase(k));

      const challenge = await ChallengeService.updateWithLog(challengeId, challengeChanges);
      return resolve(challenge)
    }catch (error){
      return reject(error)
    }
  })
}

export const deleteChallenge = async (challengeId : string): Promise<boolean> => {
  return new Promise (async (resolve, reject)=>{
    try{
      await ChallengeService.deactivateChallenge(challengeId);
      return resolve(true)
    }catch(error){
      return reject(error)
    }
  })
}

export const listSolutions = async (challengeId: string): Promise<SolutionI []> => {
  return new Promise (async (resolve, reject)=> {
    try {
      const listSolutions = await ChallengeService.listSolutions(challengeId)
      return resolve(listSolutions)
    }catch (error){
      return reject(error)
    }
  })
}