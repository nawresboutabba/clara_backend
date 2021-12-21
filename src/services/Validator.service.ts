import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Validator, { ValidatorI } from "../models/validator";

const ValidatorService = {
    async getValidatorActiveById(validatorId:string):Promise<ValidatorI>{
        return new Promise((resolve, reject)=> {
            try{
                const validator = Validator.findOne({
                    validatorId: validatorId,
                    active: true
                })
                return resolve(validator)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_VALIDATOR_ACTIVE_BY_ID,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async getAllValidatorListById(validators: Array<string>):Promise<Array<ValidatorI>>{
        return new Promise(async (resolve, reject) => {
            try{
                const validatorsResp = await Validator.find({
                    $and: [{
                        validatorId:{
                            $in: validators
                        },
                        active: true
                    }]
                })
                return resolve (validatorsResp)
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
    async newValidator(validator: ValidatorI):Promise<ValidatorI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const resp = await Validator.create(
                    validator
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
    }
}

export default ValidatorService;