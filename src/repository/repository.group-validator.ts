import IntegrantService from "../services/Integrant.service"
import * as _ from 'lodash';
import GroupValidatorService from "../services/GroupValidator.service";
import { GroupValidatorBody } from "../controller/group-validator";
import { GroupValidatorI } from "../models/group-validator";
import { nanoid } from "nanoid";

export const newGroupValidator = async (body:GroupValidatorBody)=> {
    return new Promise(async (resolve, reject)=> {
        try{
            const groupValidator: GroupValidatorI = {
                groupValidatorId: nanoid(),
                name: body.name,
                created: new Date()
            }
            
            const resp = await GroupValidatorService.newGroupValidator(groupValidator)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}