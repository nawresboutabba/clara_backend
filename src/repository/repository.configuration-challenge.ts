import { RESOURCE } from "../constants"
import { ConfigurationBody } from "../controller/configuration"
import { ConfigurationDefaultI } from "../models/configuration.default"
import ConfigurationService from "../services/Configuration.service"
import { toCamelCase } from "../utils/general/to-camel-case"


export const getChallengeConfiguration = async (): Promise<ConfigurationDefaultI> => {
    return new Promise(async (resolve, reject)=> {
        try{
            const configuration = await ConfigurationService.getConfigurationDefault(RESOURCE.CHALLENGE)
            return resolve(configuration)
        }catch(error){
            return reject(error)
        }
    })
}

  export const setDefaultConfiguration = async (configuration: ConfigurationBody, situation: string): Promise<ConfigurationDefaultI> => {
      return new Promise(async (resolve, reject)=> {
          try{
            const configurationDefault = await ConfigurationService.getConfigurationDefault(situation) 
            let configurationCamelCase = toCamelCase(configuration)
            configurationCamelCase.situationConfig = situation,
            configurationCamelCase.updated = new Date() 
            
            if(configurationDefault){
                const configurationResp = await ConfigurationService.updateConfigurationDefault(situation, configurationCamelCase)
                return resolve(configurationResp)
            }
    
            const configurationResp = await ConfigurationService.setConfiguration(configurationCamelCase)
            return resolve(configurationResp)
          }catch(error){
              return reject(error)
          }
    })
  }