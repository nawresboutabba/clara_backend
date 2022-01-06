import AreaService from "../services/Area.service"
import IntegrantService from "../services/Integrant.service"
import * as _ from 'lodash';
import GroupValidatorService from "../services/GroupValidator.service";

export const newGroupValidator = async (name: string, integrants: Array<string>, area: string)=> {
    return new Promise(async (resolve, reject)=> {
        try{
            const integrantsArray = _.uniq(integrants)
            const integrantsInstance = await IntegrantService.getAllIntegrantsListById(integrantsArray)
            const areaInstance = await AreaService.getAreaById(area)
            if (areaInstance){
                const groupValidator = await GroupValidatorService.newGroupValidator(name, integrantsInstance, areaInstance)
                return resolve(groupValidator)
            }
            return reject(new Error("wep"))

        }catch(error){
            return reject(error)
        }
    })
}