import { COMMITTE_ROLE, ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Integrant, { IntegrantI } from "../models/integrant";
import { IntegrantStatusI } from "../models/integrant";
import { getGeneralMembers } from "../repository/repository.integrants";

const IntegrantService = {
    async getIntegrantActiveById(integrantId:string):Promise<IntegrantI>{
        return new Promise((resolve, reject)=> {
            try{
                const integrant = Integrant.findOne({
                    integrantId: integrantId,
                    active: true
                })
                return resolve(integrant)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_INTEGRANT_ACTIVE_BY_ID,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async getAllIntegrantsListById(integrants: Array<string>):Promise<Array<IntegrantI>>{
        return new Promise(async (resolve, reject) => {
            try{
                const integrantsResp = await Integrant.find({
                    $and: [{
                        integrantId:{
                            $in: integrants
                        },
                        active: true
                    }]
                })
                return resolve (integrantsResp)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_ALL_VALIDATORS_BY_ID,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }

        })
    },
    async newIntegrant(integrant: IntegrantI):Promise<IntegrantI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const resp = await Integrant.create(
                    integrant
                )
                return resolve(resp)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.NEW_VALIDATOR,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async deleteIntegrant(integrantId:string):Promise<boolean>{
        return new Promise(async (resolve, reject)=> {
            try{
               await Integrant.findOneAndUpdate({
                    integrantId:integrantId
                },{
                    active: false,
                    finished: new Date
                })
                return resolve(true)
            }catch(error){
                return reject (error)
            }
 
        })
    },
    async checkUserInCommitte(userId: string): Promise<IntegrantStatusI> {
        return new Promise(async (resolve, reject)=> {
            try{
                /**
                 * @TODO
                 * FindOne return value, but user null when userId isn't OK.
                 * FindOne don't have to return a value when userId isn't OK
                 */
                const integrant = await Integrant
                .findOne({
                })
                .populate({
                    path: 'user',
                    match: {
                        userId: userId
                    },
                })

                /**
                 * Relationated with @TODO above. 
                 * If integrant is null then integrant.user throw error
                 */
                if(integrant?.user){
                    if(integrant.active == true){
                        const resp: IntegrantStatusI = {
                            isActive: true,
                            exist:true,
                            role: integrant.role,
                            integrantId: integrant.integrantId
                        }
                        return resolve(resp)
                    }
                    if(integrant.active == false){
                        const resp: IntegrantStatusI = {
                            isActive: false,
                            exist:true,
                            role: integrant.role,
                            integrantId: integrant.integrantId
                        }
                        return resolve(resp)                        
                    }
                }else {
                    const resp: IntegrantStatusI = {
                        isActive: false,
                        exist:false,
                    }
                    return resolve(resp)                      
                }
            }catch(error){
                /**
                 * Generic Error 
                 */
                const customError = new ServiceError (
                    ERRORS.SERVICE.CHECK_USER_IN_COMMITTE,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async activateIntegrant(integrantId: string, role: string): Promise<IntegrantI>{
        return new Promise((resolve, reject)=> {
            try{
                const integrant = Integrant.findOneAndUpdate({
                    integrantId: integrantId
                },{
                    created: new Date(),
                    finished: null,
                    role: role,
                    active:true
                })
                return resolve(integrant)
            }catch(error){
                return reject(error)
            }
        })
    },
    async checkIntegrantStatus(integrantId:string):Promise<IntegrantStatusI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const integrant = await Integrant.findOne({
                    integrantId:integrantId
                })
                if(integrant){
                    const integrantStatus: IntegrantStatusI = {
                        isActive:integrant.active,
                        exist: true,
                        role: integrant.role,
                        integrantId: integrant.integrantId
                    }
                    return resolve(integrantStatus)
                }
                const integrantStatus: IntegrantStatusI = {
                    isActive:false,
                    exist: false,
                }
                return resolve(integrantStatus)
            }catch(error){
                return reject(error)
            }
        })
    },
    async convertToLeader(integrantId: string, currentData?: Date): Promise<IntegrantI> {
        return new Promise(async (resolve, reject)=> {
            try{
                if(!currentData){
                    currentData = new Date()
                }

                const integrant = await Integrant.findOneAndUpdate({
                    integrantId:integrantId,
                    active:true,
                    role: COMMITTE_ROLE.GENERAL
                },{
                    lastChangePosition: currentData,
                    role: COMMITTE_ROLE.LEADER
                })
                return resolve(integrant)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.CONVERT_TO_LEADER,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async currentLeader ():Promise<IntegrantI | void>{
        return new Promise(async (resolve, reject)=> {
            try{
                const currentLeader = await Integrant.find({
                  role:COMMITTE_ROLE.LEADER,
                  active: true  
                })
                if(currentLeader.length == 0){
                    return resolve()
                }
                if(currentLeader.length == 1){
                    return resolve(currentLeader[1])
                }else{
                    const customError = new ServiceError(
                        ERRORS.SERVICE.MULTIPLES_CURRENT_LEADER,
                        HTTP_RESPONSE._500
                    )
                    return reject(customError)
                }
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.MULTIPLES_CURRENT_LEADER,
                    HTTP_RESPONSE._500
                )
                return reject(customError)
            }
        })
    },
    async abdicationLeader(currentData?: Date):Promise<IntegrantI>{
        return new Promise((resolve, reject)=>{
            try{
                if (!currentData){
                    currentData = new Date()
                }
                const general = Integrant.findOneAndUpdate({
                    active:true,
                    rol:COMMITTE_ROLE.LEADER
                },{
                    rol:COMMITTE_ROLE.GENERAL,
                    lastChangePosition: currentData
                })
                return resolve(general)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.ABDICATION_LEADER,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async getAllMembers(): Promise<Array<IntegrantI>> {
        return new Promise(async (resolve, reject)=> {
            try{
                const members = await Integrant.find({
                    isActive: true.valueOf,
                    finished: null
                })
                return resolve(members)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_COMMITTE_MEMBERS,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async getGeneralMembers():Promise<Array<IntegrantI>>{
        return new Promise((resolve, reject)=> {
            try{
                const generalMembers = Integrant.find({
                    active: true,
                    finished: null,
                    role: COMMITTE_ROLE.GENERAL
                })
                return resolve(generalMembers)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_COMMITTE_GENERAL,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    }
}

export default IntegrantService;