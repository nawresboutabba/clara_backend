import { RESOURCE } from "../constants"
import { ConfigurationBody } from "../controller/configuration"
import { ConfigurationDefaultI } from "../models/configuration.default"
import ConfigurationService from "../services/Configuration.service"
import { toCamelCase } from "../utils/general/to-camel-case"


export const getChallengeConfiguration = async (): Promise<ConfigurationDefaultI> => {
  try{
    const configuration = await ConfigurationService.getConfigurationDefault(RESOURCE.CHALLENGE)
    return configuration
  }catch(error){
    return Promise.reject(error)
  }
}

export const setDefaultConfiguration = async (configuration: ConfigurationBody, situation: string): Promise<ConfigurationDefaultI> => {
  try{
    const configurationDefault = await ConfigurationService.getConfigurationDefault(situation) 
    const configurationCamelCase = toCamelCase(configuration)
    configurationCamelCase.situationConfig = situation,
    configurationCamelCase.updated = new Date() 
            
    if(configurationDefault){
      const configurationResp = await ConfigurationService.updateConfigurationDefault(situation, configurationCamelCase)
      return configurationResp
    }
    
    const configurationResp = await ConfigurationService.setConfiguration(configurationCamelCase)
    return configurationResp
  }catch(error){
    return Promise.reject(error)
  }
}