import { ERRORS, HTTP_RESPONSE, COMMITTE_ROLE } from "../constants";
import RepositoryError from "../handle-error/error.repository";
import { IntegrantI } from "../models/integrant";
import UserService from "../services/User.service";
import IntegrantService from "../services/Integrant.service";
import { nanoid } from 'nanoid'
import { genericArrayIntegrantFilter, genericIntegrantFilter } from "../utils/field-filters/integrant";
import { IntegrantResponse } from "../controller/integrant";
import { UserI } from "../models/users";


/**
 * Add a new integrant to committe . The role can be LEADER or GENERAL.
 * If the user was a member, then he has to be activate. 
 * @param userId user that is activate
 * @param role role assigned
 * @returns 
 */

export const newIntegrant = async (user: UserI, functionDescription: string): Promise<IntegrantResponse> => {
	return new Promise (async (resolve, reject)=> {
		try{
			/**
             * Check that the status integrant. 
             * exist: if the user was/is a memeber, then true.
             * active: user exist and nowaday is a member, then true
             * role: if user exist, then has role. this field not depend on active flag
             * 
             */
			const check = await IntegrantService.checkUserInCommitte(user)
			/**
             * User is member and active. They can't be added again.
             */
			if (check.exist && check.isActive){
				const customError = new RepositoryError(
					ERRORS.REPOSITORY.ACTIVE_MEMBER,
					HTTP_RESPONSE._500
				)
				return reject(customError)
			}
			/**
             * User was a member. He's added again to committe
             */
			if(check.exist && !check.isActive){
				/**
                 * User was a member but nowaday isn't active . Register as a GENERAL MEMBER
                 */
				const integrant = await IntegrantService.activateIntegrant(
					check.integrantId,
					COMMITTE_ROLE.GENERAL
				)
				const resp = genericIntegrantFilter(integrant)
				return resolve(resp)
			}
			/**
        * User wasn't / isn't a member . He's register as a GENERAL MEMBER
        */
			if(!check.exist){              
				if (user){
					const currentDate = new  Date()
					const integrantNew = {
						user,
						integrantId: nanoid(),
						active: true,
						created: currentDate,
						lastChangePosition: currentDate,
						role: COMMITTE_ROLE.GENERAL,
						functionDescription
					}
					const integrant = await IntegrantService.newIntegrant(integrantNew)
					const resp = genericIntegrantFilter(integrant)
					return resolve(resp)
				}else{
					throw new RepositoryError(
						ERRORS.REPOSITORY.USER_NOT_EXIST,
						HTTP_RESPONSE._404
					)
				}
			}
		}catch(error){
			return reject(error)
		}
	})
}

export const isIntegrant = async (integrantId: string): Promise<boolean> => {
	return new Promise ((resolve, reject)=> {
		try{
			const integrant = IntegrantService.getIntegrantActiveById(integrantId)
            
			if(integrant){
				return resolve(true)
			}
			return resolve(false)

		}catch(error){
			return reject(error)
		}
	})
}

export const deleteGeneralMember = async (integrantId:string ): Promise<boolean> => {
	return new Promise(async (resolve, reject)=> {
		try{
			const integrant = await IntegrantService.getIntegrantActiveById(integrantId)
            
			if(integrant){
				const resp = await IntegrantService.deleteIntegrant(integrantId)
				return resolve(true)
			}else {
				const customError = new RepositoryError(
					ERRORS.REPOSITORY.MEMBER_IS_INACTIVE_OR_NOT_EXIST,
					HTTP_RESPONSE._404
				)
				return reject (customError)                
			}
		}catch(error){
			return reject(error)
		}
	})
}

export const newLeader= async (integrantId: string):Promise<IntegrantResponse>=> {
	return new Promise(async (resolve, reject)=> {
		try{
			const check = await IntegrantService.checkIntegrantStatus(integrantId)
			if (check.exist && check.isActive){
				if(check.role == COMMITTE_ROLE.GENERAL){
					const currentData = new Date()
					/**
                     * Check for by current leader
                     */
					const currentLeader = await IntegrantService.currentLeader()
                    
					if(currentLeader){
						await IntegrantService.abdicationLeader(currentData)
					}
					/**
                     * Convert from committe general to leader
                     */
					const leader = await IntegrantService.convertToLeader(integrantId, currentData)
					const resp = await genericIntegrantFilter(leader)
					return resolve(resp)
				}else{
					const customError = new RepositoryError(
						ERRORS.REPOSITORY.MEMBER_IS_A_LEADER_OR_ROLE_NOT_EXIST,
						HTTP_RESPONSE._404
					)
					return reject (customError)    
				}
			}else {
				const customError = new RepositoryError(
					ERRORS.REPOSITORY.MEMBER_IS_INACTIVE_OR_NOT_EXIST,
					HTTP_RESPONSE._404
				)
				return reject (customError)                  
			}
		}catch(error){
			const customError = new RepositoryError(
				ERRORS.REPOSITORY.NEW_LEADER,
				HTTP_RESPONSE._404
			)
			return reject(customError)
		}
	})
}

export const getAllCommitte = async (): Promise<Array<IntegrantI>> => {
	return new Promise(async (resolve, reject)=> {
		try{
			const committe = await IntegrantService.getAllActiveMembers()
			return resolve(committe)
		}catch(error){
			const customError = new RepositoryError(
				ERRORS.REPOSITORY.GET_COMMITTE_MEMBERS,
				HTTP_RESPONSE._500,
				error
			)
			return reject(customError)
		}
	})
}

export const getGeneralMembers = async(): Promise<Array<IntegrantResponse>> => {
	return new Promise(async (resolve, reject)=> {
		try{
			const generalMembers = await IntegrantService.getGeneralMembers()
			const resp = await genericArrayIntegrantFilter(generalMembers)
			return resolve(resp)
		}catch(error){
			return reject(error)
		}
	})
}