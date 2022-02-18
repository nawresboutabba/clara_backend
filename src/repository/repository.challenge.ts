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
import { ERRORS, HTTP_RESPONSE, WSALEVEL } from "../constants";
import CommentService from "../services/Comment.service";
import { ReactionBody, ReactionResponse } from "../controller/reaction";
import ReactionService from "../services/Reaction.service";
import { isReaction } from "./repository.reaction";
import { genericReactionFilter } from "../utils/field-filters/reaction";
import AreaService from "../services/Area.service";
import { AreaI } from "../models/organization.area";

export const newChallenge = async (body:ChallengeBody, user:UserRequest): Promise<ChallengeResponse> => {
    return new Promise (async (resolve, reject)=> {
        try{
            const created = new Date();

            const insertedBy = await UserService.getUserActiveByUserId(user.userId)
            const authorEntity = await UserService.getUserActiveByUserId(user.userId)
            const groupValidator = await GroupValidatorService.getGroupValidatorById(body.group_validator)
            
            let data: ChallengeI = {
              insertedBy,
              updatedBy: insertedBy,
              author: authorEntity, 
              created,
              challengeId: nanoid(),
              title: body.title,
              description: body.description,
              images: body.images,
              groupValidator,
              status: "LAUNCHED",
              active: true, 
              fileComplementary: body.file_complementary,
              isStrategic: body.is_strategic,
              /**
               * Configuration section
               */
              canShowDisagreement: body.can_show_disagreement,
              canFixDisapprovedIdea: body.can_fix_disapproved_idea,
              canChooseScope: body.can_choose_scope,
              isPrivated: body.is_privated,
              canChooseWSALevel: body.can_choose_WSALevel,
              WSALevelAvailable: body.WSALevel_available,
              WSALevelChosed: body.WSALevel_chosed,
              communityCanSeeReactions: body.community_can_see_reactions,
              minimumLikes: body.minimum_likes,
              maximumDontUnderstand: body.maximum_dont_understand,
              reactionFilter: body.reaction_filter,
              participationModeAvailable: body.participation_mode_available,
              participationModeChosed: body.participation_mode_chosed,
              timeInPark: body.time_in_park,
              timeExpertFeedback: body.time_expert_feedback,
              timeIdeaFix: body.time_idea_fix,
              externalContributionAvailableForCommittee: body.external_contribution_available_for_committee,
              externalContributionAvailableForGenerators: body.external_contribution_available_for_generators,
              finalization: body.finalization,
            }

            if (data.WSALevelChosed == WSALEVEL.AREA){
               let areasAvailable: Array<AreaI> = await AreaService.getAreasById(body.areas_available)
               data.areasAvailable = areasAvailable
            }

            const challenge = await ChallengeService.newChallenge({
              ...data
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