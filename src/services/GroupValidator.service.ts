import ServiceError from "../handle-error/error.service";
import GroupValidator, { GroupValidatorI } from "../models/group-validator";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { IntegrantI } from "../models/integrant";
import { AreaI } from "../models/organization.area";

const GroupValidatorService = {
    async getGroupValidatorById(GVId:string ): Promise<GroupValidatorI>{
        return new Promise (async (resolve, reject)=> {
            try{
                /**
                 * If group validator ID is null, then error
                 */

                let groupValidator = await GroupValidator.findOne({
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
    async newGroupValidator (name: string, integrants: Array<IntegrantI>, area: AreaI) {
        return new Promise((resolve, reject)=> {
            try{
                const groupValidator = GroupValidator.create({
                    name,
                    created: new Date(),
                    integrants,
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