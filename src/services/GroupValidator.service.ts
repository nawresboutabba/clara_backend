import ServiceError from "../handle-error/error.service";
import GroupValidator, { GroupValidatorI } from "../models/group-validator";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { ValidatorI } from "../models/validator";
import { AreaI } from "../models/organization.area";

const GroupValidatorService = {
    async getGroupValidatorById(groupValidatorId:string ): Promise<GroupValidatorI>{
        return new Promise (async (resolve, reject)=> {
            try{
                const groupValidator = await GroupValidator.findOne({
                    groupValidatorId: groupValidatorId
                })
                return resolve(groupValidator)
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
    async newGroupValidator (name: string, validators: Array<ValidatorI>, area: AreaI) {
        return new Promise((resolve, reject)=> {
            try{
                const groupValidator = GroupValidator.create({
                    name,
                    created: new Date(),
                    validators,
                    area
                })
                return resolve(groupValidator)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.NEW_GROUP_VALIDATOR,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    }
}

export default GroupValidatorService;