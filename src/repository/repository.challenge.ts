import { ChallengeBody } from "../controller/challenge";
import { ChallengeI } from "../models/situation.challenges";
import { SolutionI } from "../models/situation.solutions";
import ChallengeService from "../services/Challenge.service";
import { nanoid } from 'nanoid'
import { UserRequest } from "../controller/users";
import * as _ from 'lodash';
import UserService from "../services/User.service";

export const newChallenge = async (body:ChallengeBody, user:UserRequest): Promise<ChallengeI> => {
    return new Promise (async (resolve, reject)=> {
        try{
            const created = new Date();
            const {
              description,
              images,
              time_period: timePeriod,
              validators,
              referrer,
              title,
              work_space_available: workSpaceAvailable,
            } = body;
            const author = await UserService.getUserActiveByUserId(user.userId)
            const challenge = await ChallengeService.newChallenge({
              author: author, 
              challengeId: nanoid(),
              title,
              created,
              isStrategic: false,
              description,
              status: "LAUNCHED",
              images,
              active: true, 
              timePeriod,
              // @TODO parameter have to get from req.body
              WSALevel: "COMPANY",
              fileComplementary: "http://archivo.pdf"
            });  
            return resolve(challenge)          
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