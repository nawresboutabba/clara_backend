import Challenge, { ChallengeI } from "../models/situation.challenges";
import { startSession } from 'mongoose';
import HistoricalChallenge from "../models/historical-challenges";
import * as _ from 'lodash'; 
import { SolutionI } from "../models/situation.solutions";
import SolutionService from "./Solution.service";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

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
    async newChallenge (challenge : ChallengeI): Promise<any>{
        return new Promise((resolve, reject) => {
          Challenge.create(challenge)
            .then((response) => {
                //_.omit(resp.toJSON(), ["_id", "__v"])
              resolve(response);
            })
            .catch((err) => {
              reject(err);
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
    async listSolutions (challengeId: string, init:number, offset:number): Promise<SolutionI[]>{
        const solutions = await SolutionService.listSolutionsChallenge(challengeId, init, offset)
        return solutions
      }
}

export default ChallengeService;