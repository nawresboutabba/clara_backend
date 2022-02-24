import { SolutionI } from "../models/situation.solutions";
import { ChallengeI } from '../models/situation.challenges';
import { SolutionBody, SolutionResponse } from "../controller/solution";
import { UserRequest } from "../controller/users";
import SolutionService from "../services/Solution.service";
import ChallengeService from "../services/Challenge.service";
import { PARTICIPATION_MODE, RESOURCE, SOLUTION_STATUS, WSALEVEL } from '../constants'
import { nanoid } from 'nanoid'
import * as _ from 'lodash';
import UserService from "../services/User.service";
import { genericArraySolutionsFilter, genericSolutionFilter } from "../utils/field-filters/solution";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { newTeam } from "./repository.team"
import { TeamI } from "../models/team";
import { generateSolutionCoauthorshipInvitation, generateSolutionTeamInvitation } from "./repository.invitation";
import ConfigurationService from "../services/Configuration.service";
import {  ConfigurationSettingI } from "../models/configuration.default";
import { UserI } from "../models/users";

export const newSolution = async (body:SolutionBody,  user: UserRequest, utils: any, challengeId?: string):Promise<SolutionResponse> => {
	return new Promise (async (resolve, reject)=> {
		try {
			const guests = utils.guests
			const insertedBy = await UserService.getUserActiveByUserId(user.userId)
			/**
           * Solution have to have setted `author` or `team`.
           * If both are undefined or null, then throw error
           */
			const creator = utils.creator

			let challenge: ChallengeI
			let data: SolutionI
			if (challengeId){
				challenge = await ChallengeService.getChallengeActiveById(challengeId)
			}
			const created = new Date();

			let configuration: ConfigurationSettingI
			if(challengeId){
				configuration = getConfigurationFromChallenge(body, challenge)
			} else {
				const defaultSolutionConfiguration = await ConfigurationService.getConfigurationDefault(RESOURCE.SOLUTION)
				configuration = getConfigurationFromDefaultSolution(body, defaultSolutionConfiguration)
			}      
			/**
           * If the challenge's solution, 
           * then title is the same that challenge. 
           * For this reason, is undefined in the solution.
           */
			const title = challengeId ? challenge.title : body.title
			const description = challengeId ? challenge.description : body.description
			const groupValidator = challengeId ? challenge.groupValidator: undefined

			data = {
				insertedBy,
				updatedBy: insertedBy,
				solutionId: nanoid(),
				title,
				challengeId,
				challenge,
				description: description,
				departmentAffected: utils.departmentAffected,
				created: created,
				active: true,
				updated: created,
				status: SOLUTION_STATUS.DRAFT,
				fileComplementary: body.file_complementary,
				images: body.images,
				groupValidator,
				proposedSolution: body.proposed_solution,
				...configuration,
			}
			if (data.WSALevelChosed == WSALEVEL.AREA){
				data.areasAvailable = challenge.areasAvailable
			}
          
			/**
           * Participation Mode Choosed
           */
			if (body.participation.chosed_mode == PARTICIPATION_MODE.TEAM){
				const team : TeamI  = await newTeam(creator, body.participation.team_name)
				data.team = team
			}else if (body.participation.chosed_mode == PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
				data.author = creator
				data.coauthor = guests
			}

			const solution = await SolutionService.newSolution(data, challenge);   
			/**
             * Create invitations
             */
			if (body.participation.chosed_mode == PARTICIPATION_MODE.TEAM){
				generateSolutionTeamInvitation(creator, guests, solution, solution.team)
			}else if (body.participation.chosed_mode == PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
				generateSolutionCoauthorshipInvitation(creator, guests, solution)
			}
            
			const resp = genericSolutionFilter(solution)
			return resolve(resp)  
		}catch (error) {
			return reject (error)
		}
	}) 
}

export const updateSolutionPartially = async (body: SolutionBody, resources: any, user: UserI ,utils: any ): Promise<SolutionResponse> =>  {
	return new Promise (async (resolve, reject)=> {
		try{
			const currentSolution = resources.solution
			const change = {
				updatedBy: user,
				title: body.title != currentSolution.title ? body.title : undefined,
				description: body.description != currentSolution.description ? body.description : undefined,
				images: body.images != currentSolution.images ? body.images : undefined,
				departmentAffected: utils.departmentAffected != currentSolution.departmentAffected ? utils.departmentAffected : undefined,
				isPrivated: body.is_privated != currentSolution.isPrivated ? body.is_privated : undefined,
				WSALevelChosed: body.WSALevel_chosed != currentSolution.WSALevelChosed ? body.WSALevel_chosed : undefined,
			}

			const solution = await SolutionService.updateWithLog(currentSolution.solutionId, change);
      
			const resp = genericSolutionFilter(solution)

			return resolve(resp)
		}catch (error){
			return reject(error)
		}
	})
}

export const deleteSolution = async (solutionId: string): Promise<boolean> => {
	return new Promise (async (resolve, reject)=> {
		try {
			await SolutionService.deactivateSolution(solutionId);
			return resolve(true)
		}catch (error){
			/**
       * @TODO set error
       */
			return reject("ERROR_ELIMINAR_SOLUTION")
		}
	})
}

export const getSolution = (solutionId: string, solution: SolutionI): Promise <SolutionResponse>=> {
	return new Promise (async (resolve, reject)=> {
		const resp = genericSolutionFilter(solution)
		return resolve(resp)
	})
}

export const listSolutions = async (query: QuerySolutionForm,challengeId?: string ): Promise<SolutionResponse []> => {
	return new Promise (async (resolve, reject)=> {
		try {
			const listSolutions = await SolutionService.listSolutions(query, challengeId)
			/**
       * @TODO list solutions filter with minimal data
       */
			const resp = await genericArraySolutionsFilter(listSolutions)
			return resolve(resp)
		}catch (error){
			return reject(error)
		}
	})
}

const getConfigurationFromChallenge  = (body: SolutionBody, challenge: ChallengeI): ConfigurationSettingI => {
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
		WSALevelChosed: challenge.WSALevelChosed ,
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
		participationModeChosed: challenge.participationModeAvailable.includes(body.participation.chosed_mode)? body.participation.chosed_mode : challenge.participationModeChosed,
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
		WSALevelChosed: defaultSolutionConfiguration.canChooseWSALevel == true? body.WSALevel_chosed : defaultSolutionConfiguration.WSALevel_chosed,    
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
		participationModeChosed: defaultSolutionConfiguration.participationModeAvailable.includes(body.participation.chosed_mode) == true? body.participation.chosed_mode : defaultSolutionConfiguration.participationModeChosed,    
		timeInPark: defaultSolutionConfiguration.timeInPark,
		timeExpertFeedback: defaultSolutionConfiguration.timeExpertFeedback,
		timeIdeaFix: defaultSolutionConfiguration.timeIdeaFix,
		externalContributionAvailableForGenerators: defaultSolutionConfiguration.externalContributionAvailableForGenerators,
		externalContributionAvailableForCommittee: defaultSolutionConfiguration.externalContributionAvailableForCommittee,
	}
	return configuration
}