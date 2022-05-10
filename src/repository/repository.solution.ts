import { SolutionI } from "../models/situation.solutions";
import { ChallengeI } from '../models/situation.challenges';
import { EvaluationNoteResponse, LightSolutionResponse, SolutionBody, SolutionResponse } from "../controller/solution";
import SolutionService, { SolutionEditablesFields } from "../services/Solution.service";
import ChallengeService from "../services/Challenge.service";
import { COMMENT_LEVEL, ERRORS, HTTP_RESPONSE, INTERACTION, PARTICIPATION_MODE, RESOURCE, SOLUTION_STATUS, WSALEVEL } from '../constants'
import { nanoid } from 'nanoid'
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericArraySolutionsFilter, genericSolutionFilter } from "../utils/field-filters/solution";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { newTeam } from "./repository.team"
import { TeamI } from "../models/team";
import { generateSolutionCoauthorshipInvitation, generateSolutionTeamInvitation } from "./repository.invitation";
import ConfigurationService from "../services/Configuration.service";
import { ConfigurationSettingI } from "../models/configuration.default";
import { UserI } from "../models/users";
import { getCurrentDate } from "../utils/date";
import { logVisit } from "../utils/general/log-visit";
import { getComments, newComment } from "./repository.comment";
import { CommentBody, CommentResponse } from "../controller/comment";
import { genericCommentFilter } from "../utils/field-filters/comment";
import { CommentI } from "../models/interaction.comment";
import BaremoStateMachine from "../utils/state-machine/state-machine.baremo";
import SolutionStateMachine from "../utils/state-machine/state-machine.solution";
import BaremoService from "../services/Baremo.service";
import RepositoryError from "../handle-error/error.repository";
import { genericBaremoFilter } from "../utils/field-filters/baremo";
import { BaremoResponse } from "../controller/baremo";
import { BaremoI } from "../models/baremo";
import { EvaluationNoteI } from "../models/evaluation-note";
import EvaluationNoteService from "../services/EvaluationNote.service";
import { genericEvaluationNoteFilter } from "../utils/field-filters/evaluation-note";


export const newSolution = async (body: SolutionBody, user: UserI, utils: any, challengeId?: string): Promise<SolutionResponse> => {
  try {
    const guests = utils.guests
    const insertedBy = await UserService.getUserActiveByUserId(user.userId)
    /**
      * Solution have to have setted `author` or `team`.
      * If both are undefined or null, then throw error
      */
    const creator = utils.creator

    let challenge: ChallengeI
    if (challengeId) {
      challenge = await ChallengeService.getChallengeActiveById(challengeId, user)
    }
    const created = getCurrentDate();

    let configuration: ConfigurationSettingI
    if (challengeId) {
      configuration = getConfigurationFromChallenge(body, challenge)
    } else {
      const defaultSolutionConfiguration = await ConfigurationService.getConfigurationDefault(RESOURCE.SOLUTION)
      configuration = getConfigurationFromDefaultSolution(body, defaultSolutionConfiguration)
    }
    /**
      * If the challenge's solution, 
      * then title and description is the same that challenge. 
      */
    const title = challengeId ? challenge.title : body.title
    const description = challengeId ? challenge.description : body.description
    const groupValidator = challengeId ? challenge.groupValidator : undefined

    const data: SolutionI = {
      insertedBy,
      updatedBy: insertedBy,
      /**
       * This field has reference to the creator team or author solution, depends on the PARTICIPATION_MODE_CHOSED
       */
      author: creator,
      solutionId: nanoid(),
      title,
      challengeId,
      challenge,
      description: description,
      departmentAffected: utils.departmentAffected,
      created: created,
      tags: challengeId? challenge.tags: utils.tags,
      active: true,
      updated: created,
      status: SOLUTION_STATUS.DRAFT,
      fileComplementary: body.file_complementary,
      bannerImage: body.banner_image,
      images: body.images,
      groupValidator,
      proposedSolution: body.proposed_solution,
      version: 1,
      ...configuration,
    }
    if (challengeId && data.WSALevelChosed == WSALEVEL.AREA) {
      data.areasAvailable = challenge.areasAvailable
    } else if (body.WSALevel_chosed == WSALEVEL.AREA) {
      data.areasAvailable = utils.areas_available
    }

    /**
      * Participation Mode Choosed
      */
    if (body.participation.chosed_mode == PARTICIPATION_MODE.TEAM) {
      const team: TeamI = await newTeam(body.participation.team_name)
      data.team = team
    }

    const solution = await SolutionService.newSolution(data, challenge);
    /**
      * Create invitations. Members are added when invitation is accepted.
      */
    if (body.participation.chosed_mode == PARTICIPATION_MODE.TEAM) {
      generateSolutionTeamInvitation(creator, guests, solution, solution.team)
    } else if (body.participation.chosed_mode == PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP) {
      generateSolutionCoauthorshipInvitation(creator, guests, solution)
    }

    const resp = await genericSolutionFilter(solution)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateSolutionPartially = async (body: SolutionBody, resources: any, user: UserI, utils: any): Promise<SolutionResponse> => {
  try {
    const currentSolution = resources.solution
    const change = {
      updatedBy: user,
      title: body.title != currentSolution.title ? body.title : undefined,
      description: body.description != currentSolution.description ? body.description : undefined,
      images: body.images != currentSolution.images ? body.images : undefined,
      proposedSolution: body.proposed_solution != currentSolution.proposedSolution ? body.proposed_solution : undefined,
      departmentAffected: _.isEqual(utils.departmentAffected, currentSolution.departmentAffected) == false? utils.departmentAffected : undefined,
      isPrivated: body.is_privated != currentSolution.isPrivated ? body.is_privated : undefined,
      WSALevelChosed: body.WSALevel_chosed != currentSolution.WSALevelChosed ? body.WSALevel_chosed : undefined,
    }

    const solution = await SolutionService.updateSolutionPartially(currentSolution.solutionId, change);

    const resp = await genericSolutionFilter(solution)

    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteSolution = async (solutionId: string, user: UserI): Promise<boolean> => {
  try {
    const solution = {
      solutionId: solutionId,
      active: true,
    }
    const update = {
      active: false,
      updatedBy: user,
      updatedAt: getCurrentDate()
    }
    await SolutionService.deactivateSolution(solution, update);
    return Promise.resolve(true)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getSolution = async (solutionId: string, solution: SolutionI, user: UserI): Promise<SolutionResponse> => {
  try {
    logVisit(user, solution)
    const resp = await genericSolutionFilter(solution)
    return resp
  } catch (error) {
    return Promise.reject(error)

  }
}

export const listSolutions = async (query: QuerySolutionForm): Promise<LightSolutionResponse[]> => {
  try {
    const listSolutions = await SolutionService.listSolutions(query,{})
    /**
     * @TODO list solutions filter with minimal data
     */
    const resp = await genericArraySolutionsFilter(listSolutions)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}

export const newSolutionComment = async (comment: CommentBody, solution: SolutionI, user: UserI, utils: any): Promise<CommentResponse> => {
  try{
    const parent = utils.parentComment
    let solutionComment: CommentI =  {
      commentId: nanoid(),
      insertedBy: user,
      author:user, 
      type:INTERACTION.COMMENT,
      tag: utils.tagComment,
      scope: comment.scope,
      version: comment.version,
      comment: comment.comment,
      date: getCurrentDate(),
      solution, 
    }
    if (parent) {
      solutionComment = {...solutionComment, parent }
    }
    const com  = await newComment(solutionComment)
    const resp = await genericCommentFilter(com)
    return resp

  }catch(error){
    return Promise.reject(error)
  }
}

export const getSolutionComments = async (solution: SolutionI, query: any, user: UserI): Promise<any> => {
  try{
    const filter = {
      solution,
      scope: query.scope,
    }

    if(query.scope == COMMENT_LEVEL.GROUP){
      const responsibles = solution.coauthor.map(coauthor => coauthor.userId)
      responsibles.push(solution.author.userId)
      if(responsibles.includes(user.userId) == false){
        throw new Error('You are not authorized to see this comments')
      }
    }
    const comments = await getComments(filter)
    return comments
  }catch(error){
    return Promise.reject(error)
  }
}

export const newBaremo = async (solution: SolutionI, user: UserI, utils: any): Promise<BaremoResponse> => {
  try{
    const date = getCurrentDate()
    const baremo : BaremoI= {
      baremoId: nanoid(),
      user,
      solution,
      created: date,
      updated: date,
      /**
       * Initial State
       */
      status: BaremoStateMachine.init(),
      type: utils.baremoType,
      comment: ""
    }

    if (solution.status == SOLUTION_STATUS.READY_FOR_ANALYSIS){
      const updateSolution : SolutionEditablesFields= {
        status : SolutionStateMachine.dispatch(solution.status , "analyze"),
        startAnalysis : date,
      }
      await SolutionService.updateSolutionPartially(solution, updateSolution)
    }

    const bar = await BaremoService.newBaremo(baremo)
    const baremoFiltered = await genericBaremoFilter(bar)

    return baremoFiltered
  }catch(error){
    return Promise.reject(new RepositoryError(
      ERRORS.REPOSITORY.NEW_BAREMO,
      HTTP_RESPONSE._500,
      error
    ))
  }
}

/**
 * Get current baremo for a solution X user. If not exist return undefined
 * @param solution
 * @param user 
 * @returns 
 */
export const getCurrent = async (solution: SolutionI , user: UserI): Promise<BaremoResponse | void> => {
  try{
    const baremo = await BaremoService.getCurrentBaremoByUserAndSolution(solution, user)
    if (baremo){
      const resp = genericBaremoFilter(baremo)
      return resp
    }
    return undefined

  }catch(error){
    return Promise.reject(new RepositoryError(
      ERRORS.REPOSITORY.GET_BAREMO,
      HTTP_RESPONSE._500,
      error
    ))
  }
}

export const editBaremo = async (baremo: BaremoI, data : any): Promise<any> => {
  try{
    data = {...data, updated: getCurrentDate()}
    const result = await BaremoService.updateBaremo(baremo, data)
    const res_filtered = await genericBaremoFilter(result)
    return res_filtered
  }catch(error){
    return Promise.reject(error)
  }
}

export const newEvaluationNote = async (data: any, solution: SolutionI, user: UserI): Promise<EvaluationNoteResponse> => {
  try{
    const date = getCurrentDate()
    const evaluationNote : EvaluationNoteI= {
      title: data.title,
      description: data.description,
      noteId: nanoid(),
      type: data.type,
      user,
      solution,
      created: date,
      updated: date,
    }
    const note = await EvaluationNoteService.newEvaluationNote(evaluationNote)
    const resp = await genericEvaluationNoteFilter(note)
    return resp
  }catch(error){
    return Promise.reject(error)
  }
}
const getConfigurationFromChallenge = (body: SolutionBody, challenge: ChallengeI): ConfigurationSettingI => {
  const configuration = {
    canShowDisagreement: challenge.canShowDisagreement,
    canFixDisapprovedIdea: challenge.canFixDisapprovedIdea,
    canChooseScope: challenge.canChooseScope,
    /**
     * attribute that can be set by the person responsible 
     * for the solution or the committee, 
     * depending on the permission granted
     */
    isPrivated: challenge.canChooseScope == true ? body.is_privated : challenge.isPrivated,
    canChooseWSALevel: challenge.canChooseWSALevel,
    WSALevelAvailable: challenge.WSALevelAvailable,
    WSALevelChosed: challenge.WSALevelChosed,
    communityCanSeeReactions: challenge.communityCanSeeReactions,
    minimumLikes: challenge.minimumLikes,
    maximumDontUnderstand: challenge.maximumDontUnderstand,
    reactionFilter: challenge.reactionFilter,
    participationModeAvailable: challenge.participationModeAvailable,
    /**
     * attribute that can be set by the person responsible 
     * for the solution or the committee, 
     * depending on the permission granted
     */
    participationModeChosed: challenge.participationModeAvailable.includes(body.participation.chosed_mode) ? body.participation.chosed_mode : challenge.participationModeChosed,
    timeInPark: challenge.timeInPark,
    timeExpertFeedback: challenge.timeExpertFeedback,
    timeIdeaFix: challenge.timeIdeaFix,
    externalContributionAvailableForGenerators: challenge.externalContributionAvailableForGenerators,
    externalContributionAvailableForCommittee: challenge.externalContributionAvailableForCommittee,
  }
  return configuration
}

const getConfigurationFromDefaultSolution = (body: SolutionBody, defaultSolutionConfiguration: any): ConfigurationSettingI => {
  const configuration = {
    canShowDisagreement: defaultSolutionConfiguration.canShowDisagreement,
    canFixDisapprovedIdea: defaultSolutionConfiguration.canFixDisapprovedIdea,
    canChooseScope: defaultSolutionConfiguration.canChooseScope,
    /**
     * attribute that can be set by the person responsible 
     * for the solution or the committee, 
     * depending on the permission granted
     */
    isPrivated: defaultSolutionConfiguration.canChooseScope == true ? body.is_privated : defaultSolutionConfiguration.isPrivated,
    canChooseWSALevel: defaultSolutionConfiguration.canChooseWSALevel,
    WSALevelAvailable: defaultSolutionConfiguration.WSALevelAvailable,
    /**
     * attribute that can be set by the person responsible 
     * for the solution or the committee, 
     * depending on the permission granted
     */
    WSALevelChosed: defaultSolutionConfiguration.canChooseWSALevel == true ? body.WSALevel_chosed : defaultSolutionConfiguration.WSALevel_chosed,
    communityCanSeeReactions: defaultSolutionConfiguration.communityCanSeeReactions,
    minimumLikes: defaultSolutionConfiguration.minimumLikes,
    maximumDontUnderstand: defaultSolutionConfiguration.maximumDontUnderstand,
    reactionFilter: defaultSolutionConfiguration.reactionFilter,
    participationModeAvailable: defaultSolutionConfiguration.participationModeAvailable,
    /**
     * attribute that can be set by the person responsible 
     * for the solution or the committee, 
     * depending on the permission granted
     */
    participationModeChosed: defaultSolutionConfiguration.participationModeAvailable.includes(body.participation.chosed_mode) == true ? body.participation.chosed_mode : defaultSolutionConfiguration.participationModeChosed,
    timeInPark: defaultSolutionConfiguration.timeInPark,
    timeExpertFeedback: defaultSolutionConfiguration.timeExpertFeedback,
    timeIdeaFix: defaultSolutionConfiguration.timeIdeaFix,
    externalContributionAvailableForGenerators: defaultSolutionConfiguration.externalContributionAvailableForGenerators,
    externalContributionAvailableForCommittee: defaultSolutionConfiguration.externalContributionAvailableForCommittee,
  }
  return configuration
}
