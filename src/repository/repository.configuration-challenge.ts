import { nanoid } from "nanoid"
import { ChallengeConfigurationBody } from "../controller/configuration"
import { ChallengeConfigurationI } from "../models/configuration.challenge"
import DefaultConfigurationChallengeService from "../services/ConfigurationChallenge.service"

export const setDefaultChallengeConfiguration= async (configuration: ChallengeConfigurationBody): Promise<ChallengeConfigurationI> => {
    return new Promise(async (resolve, reject)=> {
        try{
            const currentConfiguration = await DefaultConfigurationChallengeService.getDefaultChallengeConfiguration()
            
            const date = new Date()
            const conf: ChallengeConfigurationI = {
                configurationId: nanoid(),
                updated:date,
                canChooseScope: configuration.can_choose_scope,
                isPrivate:configuration.is_private,
                filterReactionFilter: configuration.filter_reaction_filter,
                filterMinimunLikes: configuration.filter_minimum_likes,
                filterMaximunDontUnderstand:configuration.filter_maximum_dont_understand,
                communityCanSeeReactions: configuration.community_can_see_reactions,
                filterCanShowDisagreement: configuration.can_show_disagreement,
                filterCanFixDesapprovedIdea:configuration.can_fix_disapproved_idea,
                timeInPark: configuration.time_in_park,
                timeExpertFeedback: configuration.time_expert_feedback,
                timeIdeaFix:configuration.time_idea_fix,
                WSALevel: configuration.WSALevel,
                participationModeAvailable: configuration.participation_mode_available,
                isStrategic: configuration.is_strategic
            }

            if(currentConfiguration == undefined){
                const challengeConfiguration = await DefaultConfigurationChallengeService.newConfiguration(conf)
                return resolve(challengeConfiguration)
            }
            const challengeConfiguration = DefaultConfigurationChallengeService.setDefaultChallengeConfiguration(conf)
            return resolve(challengeConfiguration)
        }catch(error){
            return reject(error)
        }
    })
}