import { ChallengeBody, ChallengeResponse } from "../controller/challenge";
import { ChallengeI } from "../models/situation.challenges";
import ChallengeService from "../services/Challenge.service";
import GroupValidatorService from "../services/GroupValidator.service";
import { nanoid } from 'nanoid'
import { UserRequest } from "../controller/users";
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericArrayChallengeFilter, genericChallengeFilter } from "../utils/field-filters/challenge";
import { SolutionResponse } from "../controller/solution";
import { QueryChallengeForm } from "../utils/params-query/challenge.query.params";

export const newChallenge = async (body:ChallengeBody, user:UserRequest): Promise<ChallengeResponse> => {
    return new Promise (async (resolve, reject)=> {
        try{
            const created = new Date();
            const {
              author,
              title,
              description,
              images,
              WSALevel,
              group_validator,
              is_strategic,
              file_complementary,
              participation_mode
            } = body;

            const insertedBy = await UserService.getUserActiveByUserId(user.userId)
            const authorEntity = await UserService.getUserActiveByUserId(author)
            const groupValidator = await GroupValidatorService.getGroupValidatorById(group_validator)
   
            const challenge = await ChallengeService.newChallenge({
              insertedBy: insertedBy,
              author: authorEntity, 
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

export const getChallenge = async (challenge: ChallengeI ): Promise<ChallengeResponse> => {
  return new Promise ((resolve, reject)=> {
    const resp = genericChallengeFilter(challenge)
      return resolve(resp)
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


export const listChallenges = async (query: QueryChallengeForm):Promise<ChallengeResponse []> => {
  return new Promise(async (resolve, reject)=> {
    try{
      const challenges = await ChallengeService.listChallenges(query)
      const resp = await genericArrayChallengeFilter(challenges)
      return resolve(resp)
    }catch(error){
      return reject(error)
    }

  })
}