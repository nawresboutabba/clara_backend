import { CommitteI } from "../models/committe";
import UserService from "../services/User.service";
import * as _ from 'lodash';
import RepositoryError from "../handle-error/error.repository";
import { HTTP_RESPONSE, ERRORS } from "../constants";
import CommitteService from "../services/Committe.service";
import { UserI } from "../models/users";

export const newLeader= async (userId:string): Promise<CommitteI> => {
    return new Promise (async (resolve, reject)=> {
        try {
            const user = await UserService.getUserActiveByUserId(userId)
            if (_.isEmpty(user)){
                const customError = new RepositoryError(
                    ERRORS.REPOSITORY.LEADER_NOT_ASSOCIATED_TO_USER,
                    HTTP_RESPONSE._500
                )
                return reject(customError)
            }
            const committe = await CommitteService.newLeader(user)
            return resolve(committe)
        }catch(error){
            return reject(error)
        }
    })
}

export const newCommitte = async  (leader?: string, committe?: Array<string>):Promise<CommitteI>=>{
    return new Promise (async (resolve, reject)=> {
        try{
            let leaderInstance: UserI
            let committeInstance: Array<UserI>
            if(leader){
                leaderInstance = await UserService.getUserActiveByUserId(leader)
            }
            if (committe){
                committeInstance = await UserService.getUsers(committe)
            }
            const newCommitte = await CommitteService.newCommitte(leaderInstance , committeInstance )
            return resolve(newCommitte)
        }catch(error){
            return reject(error)
        }
    })
}