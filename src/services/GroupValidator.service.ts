import ServiceError from "../handle-error/error.service";
import GroupValidator, { GroupValidatorI } from "../models/group-validator";
import { ERRORS, HTTP_RESPONSE } from "../constants";

const GroupValidatorService = {
	async getGroupValidatorById(GVId:string ): Promise<GroupValidatorI>{
		return new Promise (async (resolve, reject)=> {
			try{
				/**
                 * If group validator ID is null, then error
                 */

				const groupValidator = await GroupValidator.findOne({
					groupValidatorId: GVId,
				})
				if(groupValidator){
					return resolve(groupValidator)
				}
				return resolve(undefined)
			}catch(error){
				const customError = new ServiceError(
					ERRORS.SERVICE.GET_GROUP_VALIDATOR,
					HTTP_RESPONSE._500,
					error
				)
				return reject(customError)
			}
		})
	},
	async newGroupValidator (groupValidator: GroupValidatorI): Promise<any> {
		return new Promise((resolve, reject)=> {
			try{
				const groupValidatorResp = GroupValidator.create({
					...groupValidator
				})
				return resolve(groupValidatorResp)
			}catch(error){
				const customError = new ServiceError(
					ERRORS.SERVICE.NEW_GROUP_VALIDATOR,
					HTTP_RESPONSE._500,
					error
				)
				return reject(customError)
			}
		})
	},
	async getAllGroupValidators (): Promise<any> {
		return new Promise(async (resolve, reject)=> {
			try{
				const groupValidatorsResp = await GroupValidator.find({})
				return resolve(groupValidatorsResp)
			}catch(error){
				const customError = new ServiceError(
					ERRORS.SERVICE.GET_ALL_GROUP_VALIDATORS,
					HTTP_RESPONSE._500,
					error
				)
				return reject(customError)
			}
		})
	}
}

export default GroupValidatorService;