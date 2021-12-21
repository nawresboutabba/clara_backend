import AreaService from "../services/Area.service"
import ValidatorService from "../services/Validator.service"
import * as _ from 'lodash';
import GroupValidatorService from "../services/GroupValidator.service";

export const newGroupValidator = async (name: string, validators: Array<string>, area: string)=> {
    return new Promise(async (resolve, reject)=> {
        try{
            const validatorsArray = _.uniq(validators)
            const validatorsInstance = await ValidatorService.getAllValidatorListById(validatorsArray)
            const areaInstance = await AreaService.getAreaById(area)
            if (areaInstance){
                const groupValidator = await GroupValidatorService.newGroupValidator(name, validatorsInstance, areaInstance)
                return resolve(groupValidator)
            }
            return reject(new Error("wep"))

        }catch(error){
            return reject(error)
        }
    })
}