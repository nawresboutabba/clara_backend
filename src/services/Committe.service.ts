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