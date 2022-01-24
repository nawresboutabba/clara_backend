import { CommitteI } from "../models/committe";
import UserService from "../services/User.service";
import * as _ from 'lodash';
import RepositoryError from "../handle-error/error.repository";
import { HTTP_RESPONSE, ERRORS } from "../constants";
import CommitteService from "../services/Committe.service";

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