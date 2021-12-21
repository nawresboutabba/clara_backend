import { HTTP_RESPONSE, ERRORS} from "../constants";
import ServiceError from "../handle-error/error.service";
import Committe, { CommitteI } from "../models/committe";
import { UserI } from "../models/users";
import * as _ from 'lodash';

const CommitteService = {
    async newLeader(user:UserI): Promise<CommitteI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const committe = await Committe.findOneAndUpdate({
                    active:true
                },{
                    $set:{
                        leader:user
                    }
                })
                return resolve(committe)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.NEW_LEADER,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }

        })
    },
    async getCommitteActive():Promise<CommitteI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const committe = await Committe.findOne({active:true})
                return resolve(committe)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_COMMITTE,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async newCommitte(leader?: UserI, general?: Array<UserI>):Promise<CommitteI>{
        return new Promise(async (resolve, reject)=> {
            try{
            let committe: CommitteI
                committe = await this.getCommitteActive()
                if (!_.isEmpty(committe)){
                    const customError = new ServiceError(
                        ERRORS.SERVICE.COMMITTE_EXIST,
                        HTTP_RESPONSE._500
                    )
                    return reject(customError)
                }
                committe = await Committe.create(
                    {
                    leader: leader,
                    committe:general
                }
                )
                return resolve(committe)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.COMMITTE_NEW,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async checkUserInCommitte(userId: string): Promise<Boolean>{
        return new Promise((resolve, reject)=> {
            const inCommitte = Committe.findOne({
                active: true
            }).populate({
                path:'committe',
                match: {
                    userId:userId 
                }
            })
            return resolve(inCommitte)
        })
    }
}
export default CommitteService;