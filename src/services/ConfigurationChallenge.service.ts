import ChallengeConfiguration, { ChallengeConfigurationI } from "../models/configuration.challenge";

const DefaultConfigurationChallengeService = {
    async newConfiguration(configuration: ChallengeConfigurationI): Promise<any>{
        return new Promise(async (resolve, reject)=> {
            const configurationResp = await ChallengeConfiguration.create({
                ...configuration
            })
            return resolve(configurationResp)
        })
    },
    async getDefaultChallengeConfiguration(): Promise<any>{
        return new Promise(async (resolve, reject)=> {
            const configuration = await ChallengeConfiguration.findOne({
            }).limit(1)
            return resolve(configuration)
        })
    },
    async setDefaultChallengeConfiguration(conf: ChallengeConfigurationI): Promise<any>{
        return new Promise(async (resolve, reject)=> {
            const configuration = await ChallengeConfiguration.findOneAndUpdate({},{...conf})
            return resolve(configuration)
        })
    }
}

export default DefaultConfigurationChallengeService