import { ConfigurationBaseI } from "../models/configuration.default"
import Configuration from '../models/configuration.default'
import { ERRORS, HTTP_RESPONSE, RESOURCE } from "../constants"
import ServiceError from "../handle-error/error.service"

const ConfigurationService = {
  async setConfiguration(configuration: ConfigurationBaseI): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const configurationResp = await Configuration.create({
        ...configuration
      })
      return resolve(configurationResp)
    })
  },
  async getConfigurationDefault (situation: string): Promise<any> {
    return new Promise(async (resolve, reject)=> {
      try {
        if (![RESOURCE.CHALLENGE, RESOURCE.SOLUTION].includes(situation)){
          throw new Error ("configuration situation does not exist")
        }

        const configuration = await Configuration.findOne({
          situationConfig: situation
        })
        return resolve(configuration)
      }catch(error){
        return reject(new ServiceError(
          ERRORS.SERVICE.GET_SOLUTION_CONFIGURATION,
          HTTP_RESPONSE._500,
          error
        ))
      }
    })
  },
  async updateConfigurationDefault(situation: string, configuration: ConfigurationBaseI): Promise<any> {
    return new Promise(async (resolve, reject)=> {
      try {
        if (![RESOURCE.CHALLENGE, RESOURCE.SOLUTION].includes(situation)){
          throw new Error ("configuration situation does not exist")
        }

        const configurationResp = await Configuration.findOneAndUpdate({
          situationConfig: situation
        }, {
          ...configuration
        }, {
          new: true
        })
        return resolve(configurationResp)
      }catch(error){
        return reject(new ServiceError(
          ERRORS.SERVICE.UPDATE_CONFIGURATION,
          HTTP_RESPONSE._500,
          error
        ))
      }
    })
  }
}

export default ConfigurationService