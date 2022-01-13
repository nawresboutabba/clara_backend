import { ChallengeBody, ChallengeResponse } from "../controller/challenge";
import { ChallengeI } from "../models/situation.challenges";
import ChallengeService from "../services/Challenge.service";
import GroupValidatorService from "../services/GroupValidator.service";
import { nanoid } from 'nanoid'
import { UserRequest } from "../controller/users";
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericArrayChallengeFilter, genericChallengeFilter } from "../utils/field-filters/challenge";
import { QueryChallengeForm } from "../utils/params-query/challenge.query.params";
import { CommentBody, CommentResponse } from "../controller/comment";
import { UserI } from "../models/users";
import { newComment } from "./repository.comment";
import { genericArrayCommentFilter, genericCommentFilter } from "../utils/field-filters/comment";
import RepositoryError from "../handle-error/error.repository";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import CommentService from "../services/Comment.service";
import { ReactionBody, ReactionResponse } from "../controller/reaction";
import ReactionService from "../services/Reaction.service";
import { isReaction } from "./repository.reaction";
import { genericReactionFilter } from "../utils/field-filters/reaction";

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

export const newChallengeComment = async (challengeId: string, commentBody:CommentBody, user: UserI): Promise<CommentResponse> => {
    return new Promise(async (resolve, reject)=> {
      try{
        let insertedBy: UserI
        const challenge = await ChallengeService.getChallengeActiveById(challengeId)
        const author = await UserService.getUserActiveByUserId(commentBody.author)
        
        if ( !(challenge && author)){
          throw new RepositoryError(
            ERRORS.REPOSITORY.CHALLENGE_OR_AUTHOR_NOT_VALID,
            HTTP_RESPONSE._500
          )
        }

        if (commentBody.author == user.userId){
          insertedBy = author
        } else {
          insertedBy = await UserService.getUserActiveByUserId(user.userId)
        }
        
        const commentChallenge = {
          insertedBy,
          author,
          isPrivate: commentBody.is_private,
          comment: commentBody.comment,
          date: new Date(),
          challenge
        }
  
        const comment = await newComment(commentChallenge)
        const resp = await genericCommentFilter(comment)
        return resolve(resp)
      }catch(error){
        return reject(error)
      }
    })
}

export const getComments = async (challengeId: string, user: UserI): Promise <CommentResponse[]> => {
  return new Promise(async (resolve, reject)=> {
    try{

    /**
     * Poner los comentarios privados a true si:
     * - El usuario es dueño de los comentarios 
     * - Es parte del comite
     * - Participa de alguna forma como creador del challenge
     * @TODO hacer una funcion para esto
     */

     const challenge = await ChallengeService.getChallengeActiveById(challengeId)
     const userEntity = await UserService.getUserActiveByUserId(user.userId)
     const comments = await CommentService.getComments(challenge, userEntity)
     const resp = await genericArrayCommentFilter(comments)
     return resolve(resp)
    }catch(error){
      return reject(error)
    }
  })
}

export const newReaction = async (challengeId: string, reaction: ReactionBody, user: UserI): Promise<ReactionResponse> => {
  return new Promise(async (resolve, reject)=> {
    try{
      const challenge = await ChallengeService.getChallengeActiveById(challengeId)
      const author = await UserService.getUserActiveByUserId(user.userId)  

      if (!(isReaction(reaction.type))){
        throw new RepositoryError(
          ERRORS.REPOSITORY.REACTION_INVALID,
          HTTP_RESPONSE._500
        )
      }

      /**
       * For reactions insertedBy and author is the same user
       */
      const newReaction = {
        insertedBy: author,
        author,
        challenge,
        type: reaction.type,
        date: new Date()
      }
  
      const reactionEntity = await ReactionService.newReaction(newReaction) 
      
      const resp = genericReactionFilter(reactionEntity)
      return resolve(resp)
    }catch(error){
      return reject(error)
    }
  })
}