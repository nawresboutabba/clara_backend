import Challenge, { ChallengeI } from "../models/situation.challenges";
import { startSession } from 'mongoose';
import HistoricalChallenge from "../models/historical-challenges";
import * as _ from 'lodash';
import ServiceError from "../handle-error/error.service";
import { CHALLENGE_TYPE, ERRORS, HTTP_RESPONSE } from "../constants";
import { QueryChallengeForm } from "../utils/params-query/challenge.query.params";
import { UserI } from "../models/users";

type editOneParams = {
  description?: string,
  images?: Array<string>,
  timePeriod?: number,
  status?: string,
  validators?: Array<string>,
  referrer?: string,
  workSpaceAvailable?: Array<string>
}

const ChallengeService = {
  async getChallengeActiveById(id: string, user: UserI): Promise<ChallengeI> {
    try {
      const resp = await Challenge.aggregate([
        {
          $match: { $and: [{ challengeId: id, active: true }] },
        },
        {
          $lookup: {
            from: "users",
            localField: "insertedBy",
            foreignField: "_id",
            as: "insertedBy"
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
          },
        },
        {
          $lookup: {
            from: "groupvalidators",
            localField: "groupValidator",
            foreignField: "_id",
            as: "groupValidator"
          },
        },
        {
          $lookup: {
            from: "areas",
            localField: "departmentAffected",
            foreignField: "_id",
            as: "departmentAffected"
          },
        },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags"
          },
        },
        {
          $lookup: {
            from: 'interactions',
            localField: "_id",    // field in the orders collection
            foreignField: "challenge",  // field in the items collection
            pipeline: [
              {
                $match: {
                  $or: [{
                    $or: [
                      { author: user },
                      { insertedBy: user }
                    ]
                  },
                  { isPrivate: false },
                  ]
                }
              }
            ],
            as: 'interactions'
          }
        },
        {
          $unwind: {
            path: "$groupValidator",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true
          },
        },
        {
          $unwind: {
            path: "$insertedBy",
            preserveNullAndEmptyArrays: true
          },
        }
      ])
      return resp[0]
    } catch (error) {
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_CHALLENGE_ACTIVE_BY_ID,
        HTTP_RESPONSE._404,
        error))
    }
  },

  async newChallenge(challenge: ChallengeI): Promise<any> {
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
  async updateWithLog(challengeId: string, challengeChanges: editOneParams): Promise<ChallengeI> {
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
  async deactivateChallenge(challengeId: string): Promise<boolean> {
    const challenge = await this.getChallengeActiveById(challengeId)
    try {
      challenge.updated = new Date()
      challenge.active = false;
      await challenge.save()
      return true
    } catch (error) {
      return error
    }
  },
  /**
   * List Challenge for Internal Employee
   * @param query 
   * @param user
   * @returns 
   */
  async listChallenges(query: QueryChallengeForm, user: UserI): Promise<Array<any>> {
    try {
      const matchQuery = {
        $and: [
          {$or:[
            {title:{$regex:`.*${query.title}.*`}},
          ]},
          {active:true},
          { participationModeAvailable: {$in: query.participationMode}},
        ]
      }
      
      const resp = await Challenge.aggregate([
        {
          $match: {
            ...matchQuery
          }
        },
        {
          $lookup: {
            from: 'interactions',
            localField: "_id",    // field in the orders collection
            foreignField: "challenge",  // field in the items collection
            pipeline: [
              {
                $match: {
                  $or: [{
                    $or: [
                      { isPrivate: true },
                      { author: user },
                      { insertedBy: user }
                    ]
                  },
                  { isPrivate: false },
                  ]
                }
              }
            ],
            as: 'interactions'
          }
        },
      ])
        .skip(query.init)
        .limit(query.offset)
        .sort(_.pickBy(query.sort, _.identity))

      return resp
    } catch (error) {
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.CHALLENGE_LISTING,
        HTTP_RESPONSE._500,
        error
      ))
    }
  },
  /**
   * List Challenge for externals users
   * @param query 
   * @param challengesParticipations 
   * @param user 
   * @returns 
   */
  async listChallengeForExternals(query: QueryChallengeForm, challengesParticipations: ChallengeI[], user: UserI): Promise<Array<any>> {
    try{
      const matchQuery = {
        $and: [
          {_id: { $in: challengesParticipations.map(c => c._id) }},
          {$or:[
            {title:{$regex:`.*${query.title}.*`}},
          ]},
          {active:true},
          { participationModeAvailable: {$in: query.participationMode}},
        ]
      }
      const resp = await Challenge.aggregate([
        {
          $match: {
            ...matchQuery
          }
        },
        {
          $lookup: {
            from: 'interactions',
            localField: "_id",  
            foreignField: "challenge",
            pipeline: [
              {
                $match: {
                  $or: [{
                    $or: [
                      { author: user },
                      { insertedBy: user }
                    ]
                  },
                  { isPrivate: false },
                  ]
                }
              }
            ],
            as: 'interactions'
          }
        },
      ])
        .skip(query.init)
        .limit(query.offset)
        .sort(_.pickBy(query.sort, _.identity))

      return resp
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.CHALLENGE_LISTING,
        HTTP_RESPONSE._500,
        error
      ))
    }
  },
  async getGenericChallenge(): Promise<any> {
    try{
      const genericChallenge = await Challenge.findOne({
        type : CHALLENGE_TYPE.GENERIC
      })
      return genericChallenge
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_GENERIC_CHALLENGE,
        HTTP_RESPONSE._500,
        error
      ))
    }



  }
}

export default ChallengeService;