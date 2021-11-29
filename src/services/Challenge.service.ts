import Challenge, { TYPE_CHALLENGE } from "../models/challenges";
import { startSession } from 'mongoose';
import HistoricalChallenge from "../models/historical-challenges";
import * as _ from 'lodash'; 

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
    async getChallengeActiveById  (id: string): Promise<TYPE_CHALLENGE> {
        return new Promise((resolve, reject) =>
          Challenge.findOne({
            challengeId: id,
            active: true,
          })
            .then((result) => {
              // Return the Document Object then could be chained with other methods
              resolve(result);
            })
            .catch((err) => {
              return reject(err);
            })
        );
    },
    async newChallenge (challenge : TYPE_CHALLENGE): Promise<TYPE_CHALLENGE>{
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
    async updateWithLog  (challengeId: string ,challengeChanges: editOneParams): Promise<TYPE_CHALLENGE> {
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
    }
}

export default ChallengeService;