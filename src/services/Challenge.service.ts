import Challenge, { ChallengeI } from "../models/situation.challenges";
import { startSession } from 'mongoose';
import HistoricalChallenge from "../models/historical-challenges";
import * as _ from 'lodash'; 
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { QueryChallengeForm } from "../utils/params-query/challenge.query.params";
import { ChallengeProposalI } from "../models/challenge-proposal";

type editOneParams = {
    description?:string,
    images?: Array<String>,
    timePeriod?: number,
    status?: string,
    validators?: Array<String>,
    referrer?: String,
    workSpaceAvailable?: Array<String>
}

const ChallengeService = {
    async getChallengeActiveById  (id: string): Promise<any> {
        return new Promise((resolve, reject) =>
          Challenge.findOne({
            challengeId: id,
            active: true,
          })
          .populate("areasAvailable")
            .then((result) => {
              return resolve(result);
            })
            .catch((err) => {
              const customError = new ServiceError(
                ERRORS.SERVICE.GET_CHALLENGE_ACTIVE_BY_ID,
                HTTP_RESPONSE._404,
                err
              )
              return reject(customError);
            })
        );
    },
    async newChallenge (challenge : ChallengeI ): Promise<any>{
        return new Promise((resolve, reject) => {
          Challenge.create(challenge)
          .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(
                new ServiceError(
                  ERRORS.SERVICE.NEW_CHALLENGE,
                  HTTP_RESPONSE._404, 
                  err));
            });
        });  
    },
    async updateWithLog  (challengeId: string ,challengeChanges: editOneParams): Promise<ChallengeI> {
        const challenge = await this.getChallengeActiveById(challengeId)
        const oldData = _.omit(challenge.toJSON(), ["_id", "__v"]);
        Object.assign(challenge, challengeChanges);
        const session = await startSession();
        try {
          session.startTransaction();
          await Promise.all([
            HistoricalChallenge.create([oldData], { session: session }),
            challenge.save({ session: session }),
          ]);
          await session.commitTransaction();
          session.endSession();

          return challenge
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          return error;
        }
    },
    async deactivateChallenge (challengeId: string): Promise<boolean> {
        const challenge = await this.getChallengeActiveById(challengeId)
        try{
            challenge.updated = new Date()
            challenge.active = false;
            await challenge.save()
            return true
        }catch(error){
            return error
        }
    },
    async listChallenges (query: QueryChallengeForm): Promise<Array<any>>{
      return new Promise(async (resolve, reject)=> {
        try{
            let findQuery = {
              ..._.pickBy({
              created: query.created,
              active:true,
              title:{
                $regex : `.*${query.title}.*`, 
              },
              participationMode: query.participationMode
            }, _.identity)
          } 

          if(query.isStrategic != undefined){
            findQuery.isStrategic = query.isStrategic
          }

          const challenges = await Challenge
          .find({...findQuery})
          .skip(query.init)
          .limit(query.offset)
          /**
           * Filter order criteria unused
           */
          .sort(_.pickBy(query.sort,_.identity))
          
          return resolve(challenges)
        }catch(error){
          return reject(new ServiceError(
            ERRORS.SERVICE.CHALLENGE_LISTING,
            HTTP_RESPONSE._500,
            error
          ))
        }
      })
    }
}

export default ChallengeService;