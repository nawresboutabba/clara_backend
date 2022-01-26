import IntegrantService from "../services/Integrant.service"
import * as _ from 'lodash';
import GroupValidatorService from "../services/GroupValidator.service";
import { GroupValidatorBody } from "../controller/group-validator";
import { GroupValidatorI } from "../models/group-validator";
import { nanoid } from "nanoid";
import { IntegrantI } from "../models/integrant";
import { genericGroupValidatorFilter } from "../utils/field-filters/group-validator";

export interface GroupValidatorResponse {
    group_validator_id: string,
    name: string,
    created: Date,
}

export const newGroupValidator = async (body:GroupValidatorBody)=> {
    return new Promise(async (resolve, reject)=> {
        try{
            /**
             * Create new group validator variable
             */
            const groupValidator: GroupValidatorI = {
                groupValidatorId: nanoid(),
                name: body.name,
                created: new Date(),
            }
            /**
            * Get integrants for new Group Validator
            */
            const integrants: IntegrantI [] = await IntegrantService.getAllIntegrantsListById(body.integrants)

            const groupValidatorDocs = await GroupValidatorService.newGroupValidator(groupValidator)
            
            /**
            * Insert integrants to group validator
            */
            await IntegrantService.insertIntegrantsToGroupValidator(integrants, groupValidatorDocs)            

            const resp = genericGroupValidatorFilter(groupValidatorDocs)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}