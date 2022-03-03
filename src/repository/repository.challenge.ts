import {
  ChallengeBody,
  ChallengeProposalResponse,
  ChallengeResponse
} from "../controller/challenge";

import SolutionStateMachine from "../utils/state-machine/state-machine.solution";
import { ChallengeI } from "../models/situation.challenges";
import ChallengeService from "../services/Challenge.service";
import GroupValidatorService from "../services/GroupValidator.service";
import { nanoid } from 'nanoid'
import { UserRequest } from "../controller/users";
import * as _ from 'lodash';
import UserService from "../services/User.service";
import {
  genericArrayChallengeFilter,
  genericChallengeFilter
} from "../utils/field-filters/challenge";
import { QueryChallengeForm } from "../utils/params-query/challenge.query.params";
import { CommentBody, CommentResponse } from "../controller/comment";
import { UserI } from "../models/users";
import { newComment } from "./repository.comment";
import { genericArrayCommentFilter, genericCommentFilter } from "../utils/field-filters/comment";
import RepositoryError from "../handle-error/error.repository";
import { ERRORS, HTTP_RESPONSE, INTERACTION, WSALEVEL } from "../constants";
import CommentService from "../services/Comment.service";
import { ReactionBody, ReactionResponse } from "../controller/reaction";
import ReactionService from "../services/Reaction.service";
import { isReaction } from "./repository.reaction";
import { genericReactionFilter } from "../utils/field-filters/reaction";
import AreaService from "../services/Area.service";
import { AreaI } from "../models/organization.area";
import ChallengeProposalService from "../services/Proposal.service";
import { ChallengeProposalI } from "../models/challenge-proposal";
import { getCurrentDate } from "../utils/date";
import { genericArrayChallengeProposalFilter, genericChallengeProposalFilter } from "../utils/field-filters/challenge-proposal";
import TeamService from "../services/Team.service";
import SolutionService from "../services/Solution.service";
import { interactionResume } from "../utils/general/interaction-resume";
import { SolutionI } from "../models/situation.solutions";

export const newChallenge = async (body: ChallengeBody, user: UserI): Promise<ChallengeResponse> => {
  try {

    const data: ChallengeI = await composeChallenge(body, user)

    const challenge = await ChallengeService.newChallenge({
      ...data
    });
    const resp = await genericChallengeFilter(challenge)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const newChallengeProposal = async (body: ChallengeBody, user: UserRequest): Promise<ChallengeProposalResponse> => {
  try {
    const challenge: ChallengeI = await composeChallenge(body, user)
    const proposalId = nanoid()
    const dateProposal = getCurrentDate()
    const data: ChallengeProposalI = { ...challenge, proposalId, dateProposal }
    const proposal: ChallengeProposalI = await ChallengeProposalService.newProposal(data)
    const resp: ChallengeProposalResponse = await genericChallengeProposalFilter(proposal)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}


const composeChallenge = async (body: ChallengeBody, user: UserRequest): Promise<ChallengeI> => {
  try {
    const created = new Date();

    const insertedBy = await UserService.getUserActiveByUserId(user.userId)
    const authorEntity = await UserService.getUserActiveByUserId(user.userId)
    const groupValidator = await GroupValidatorService.getGroupValidatorById(body.group_validator)

    const data: ChallengeI = {
      insertedBy,
      updatedBy: insertedBy,
      author: authorEntity,
      created,
      challengeId: nanoid(),
      title: body.title,
      description: body.description,
      images: body.images,
      groupValidator,
      status: SolutionStateMachine.ready(),
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

    if (data.WSALevelChosed == WSALEVEL.AREA) {
      const areasAvailable: Array<AreaI> = await AreaService.getAreasById(body.areas_available)
      data.areasAvailable = areasAvailable
    }

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getChallenge = async (challenge: ChallengeI): Promise<ChallengeResponse> => {
  try {
    const resp = await genericChallengeFilter(challenge);
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateChallengePartially = async (body: ChallengeBody, challengeId: string): Promise<ChallengeI> => {
  try {
    const challengeChanges = _.mapKeys(body, (v: any, k: any) => _.camelCase(k));
    const challenge = await ChallengeService.updateWithLog(challengeId, challengeChanges);
    return challenge
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteChallenge = async (challengeId: string): Promise<boolean> => {
  try {
    await ChallengeService.deactivateChallenge(challengeId);
    return true
  } catch (error) {
    return Promise.reject(error)
  }
}


export const listChallenges = async (query: QueryChallengeForm, user: UserI): Promise<ChallengeResponse[]> => {
  try {
    /**
     * Listing for user internals and external is not the same. 
     * The externals users just can see challenge what was invited.
     * The internals users can see all challenges.
     */
    if(user.externalUser){
      const mySolutions : SolutionI[]= await SolutionService.getParticipations(user)
      const myChallenge : ChallengeI []= mySolutions.filter((solution) => {
        if (solution.challenge){
          return solution
        }
      }).map(solution =>solution.challenge)
      const challenges = await ChallengeService.listChallengeForExternals(query, myChallenge, user);
      /**
       * @TODO reactions resume
       */
      challenges.forEach(challenge => {
        challenge.interactions = interactionResume(challenge.interactions)
      })

      const resp = await genericArrayChallengeFilter(challenges);
      return resp
    }else{
      const challenges = await ChallengeService.listChallenges(query, user)
      const resp = await genericArrayChallengeFilter(challenges)
      return resp
    }

  } catch (error) {
    return Promise.reject(error)
  }
}

export const listChallengeProposal = async (query: QueryChallengeForm): Promise<ChallengeProposalResponse[]> => {
  try {
    const challenges = await ChallengeProposalService.listProposals(query)
    const resp = await genericArrayChallengeProposalFilter(challenges)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const newChallengeComment = async (challengeId: string, commentBody: CommentBody, user: UserI): Promise<CommentResponse> => {
  try {
    let insertedBy: UserI
    const challenge = await ChallengeService.getChallengeActiveById(challengeId, user)
    const author = await UserService.getUserActiveByUserId(commentBody.author)

    if (!(challenge && author)) {
      throw new RepositoryError(
        ERRORS.REPOSITORY.CHALLENGE_OR_AUTHOR_NOT_VALID,
        HTTP_RESPONSE._500
      )
    }

    if (commentBody.author == user.userId) {
      insertedBy = author
    } else {
      insertedBy = await UserService.getUserActiveByUserId(user.userId)
    }

    const commentChallenge = {
      insertedBy,
      author,
      type: INTERACTION.COMMENT,
      isPrivate: commentBody.is_private,
      comment: commentBody.comment,
      date: new Date(),
      challenge
    }

    const comment = await newComment(commentChallenge)
    const resp = await genericCommentFilter(comment)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getComments = async (challengeId: string, user: UserI): Promise<CommentResponse[]> => {
  try {

    /**
   * Poner los comentarios privados a true si:
   * - El usuario es dueño de los comentarios 
   * - Es parte del comite
   * - Participa de alguna forma como creador del challenge
   * @TODO hacer una funcion para esto
   */

    const challenge = await ChallengeService.getChallengeActiveById(challengeId, user)
    const userEntity = await UserService.getUserActiveByUserId(user.userId)
    const comments = await CommentService.getComments(challenge, userEntity)
    const resp = await genericArrayCommentFilter(comments)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const newReaction = async (challengeId: string, reaction: ReactionBody, user: UserI): Promise<ReactionResponse> => {
  try {
    const challenge = await ChallengeService.getChallengeActiveById(challengeId, user)
    const author = await UserService.getUserActiveByUserId(user.userId)

    if (!(isReaction(reaction.type))) {
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
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getChallengeProposal = async (proposalId: string): Promise<any> => {
  try {
    const proposal = await ChallengeProposalService.getChallengeProposal(proposalId)
    return proposal
  } catch (error) {
    return Promise.reject(error)
  }
}
export const acceptChallengeProposal = async (proposalId: string): Promise<ChallengeResponse> => {
  try {
    const proposal: ChallengeProposalI = await ChallengeProposalService.getChallengeProposal(proposalId)
    const challenge = await ChallengeService.newChallenge(_.omit(proposal, ["_id", "__v"]))
    const resp = await genericChallengeFilter(challenge)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}