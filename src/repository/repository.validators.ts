import { ERRORS, HTTP_RESPONSE } from "../constants";
import RepositoryError from "../handle-error/error.repository";
import { ValidatorI } from "../models/validator";
import UserService from "../services/User.service";
import ValidatorService from "../services/Validator.service";
import { nanoid } from 'nanoid'
import CommitteService from "../services/Committe.service";


export const newValidator = async (userId: string): Promise<ValidatorI> => {
    return new Promise (async (resolve, reject)=> {
        try{

            const user = await UserService.getUserActiveByUserId(userId)
            if(user){
                const validatorNew = {
                    user,
                    validatorId: nanoid(),
                    active: true,
                    created: new Date()
                }
                const validator = await ValidatorService.newValidator(validatorNew)
                return resolve(validator)
            }
            const customError = new RepositoryError(
                ERRORS.REPOSITORY.USER_NOT_EXIST,
                HTTP_RESPONSE._404
            )
            return reject (customError)
        }catch(error){
            return reject(error)
        }
    })
}