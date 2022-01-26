import { GroupValidatorI } from "../../models/group-validator";
import { GroupValidatorResponse } from "../../repository/repository.group-validator";

export const genericGroupValidatorFilter = async (groupValidator: GroupValidatorI): Promise<GroupValidatorResponse> => {
    return new Promise(async (resolve, reject) => {
        if(!groupValidator){
            return resolve(undefined)
        }
        const {
            groupValidatorId,
            name,
            created
        } = groupValidator
        return resolve({
            group_validator_id: groupValidatorId,
            name,
            created
        })
    })
}