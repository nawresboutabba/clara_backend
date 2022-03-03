import { ChallengeResponse } from "../../controller/challenge";
import { ChallengeI } from "../../models/situation.challenges";
import { genericArrayAreaFilter } from "./area";
import { genericUserFilter } from "./user";
import { genericGroupValidatorFilter } from "./group-validator";

/**
 * Challenge information filter. 
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param challenge 
 * @returns 
 */

export const genericChallengeFilter = async (challenge : ChallengeI): Promise<ChallengeResponse> => {
  try{
    const {
      challengeId, 
      created,
      status,
      updated,
      title, 
      description , 
      active,
      fileComplementary,
      images,
      isStrategic,
      finalization,
      /**
             * Configuration section
             */
      canShowDisagreement,
      canFixDisapprovedIdea,
      canChooseScope,
      isPrivated,
      canChooseWSALevel,
      WSALevelAvailable,
      WSALevelChosed,
      communityCanSeeReactions,
      minimumLikes,
      maximumDontUnderstand,
      reactionFilter,
      participationModeAvailable,
      participationModeChosed,
      timeInPark,
      timeExpertFeedback,
      timeIdeaFix,
      externalContributionAvailableForGenerators,
      externalContributionAvailableForCommittee,
      interactions
    } = challenge
    const author = await genericUserFilter(challenge.author)
    const inserted_by = await genericUserFilter(challenge.insertedBy)
    const areas_available = await genericArrayAreaFilter(challenge.areasAvailable)
    const department_affected = await genericArrayAreaFilter(challenge.departmentAffected)
    const group_validator = await genericGroupValidatorFilter(challenge.groupValidator)
        
    return {
      challenge_id: challengeId, 
      inserted_by,
      author,
      created,
      status,
      updated,
      title, 
      description , 
      active,
      file_complementary: fileComplementary,
      images,
      is_strategic: isStrategic,
      finalization,
      department_affected,
      group_validator,
      /**
             * Configuration section
             */
      can_show_disagreement: canShowDisagreement,
      can_fix_disapproved_idea: canFixDisapprovedIdea,
      can_choose_scope: canChooseScope,
      is_privated: isPrivated,
      can_choose_WSALevel: canChooseWSALevel,
      WSALevel_available: WSALevelAvailable,
      WSALevel_chosed: WSALevelChosed,
      areas_available,
      community_can_see_reactions: communityCanSeeReactions,
      minimum_likes: minimumLikes,
      maximum_dont_understand: maximumDontUnderstand,
      reaction_filter: reactionFilter,
      participation_mode_available: participationModeAvailable,
      participation_mode_chosed: participationModeChosed,
      time_in_park: timeInPark,
      time_expert_feedback: timeExpertFeedback,
      time_idea_fix: timeIdeaFix,
      external_contribution_available_for_generators: externalContributionAvailableForGenerators,
      external_contribution_available_for_committee: externalContributionAvailableForCommittee,
      interactions
    }
  }catch(error){
    return Promise.reject(error)
  }        
}

export const lightChallengeFilter = async (challenge : ChallengeI): Promise<any> => {
  try{
    const {
      created,
      status,
      title, 
      description , 
      active,
      images,
      isStrategic,
      finalization,
      interactions
    } = challenge
    const areas_available = await genericArrayAreaFilter(challenge.areasAvailable)
    const department_affected = await genericArrayAreaFilter(challenge.departmentAffected)
    const group_validator = await genericGroupValidatorFilter(challenge.groupValidator)
    return {
      created,
      status,
      title, 
      description , 
      active,
      images,
      is_strategic: isStrategic,
      finalization,
      areas_available,
      department_affected,
      group_validator,
      interactions,
    }
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArrayChallengeFilter = async (challenges: Array<ChallengeI>): Promise<Array<any>> =>  {
  try{
    const arrayChallenge: Array<Promise<ChallengeResponse>>= []
    challenges.forEach(challenge => {
      arrayChallenge.push(lightChallengeFilter(challenge))
    })
    return await Promise.all(arrayChallenge)
      .then(result => {
        return result
      })
      .catch(error=> {
        return Promise.reject(error)
      })  
  }catch(error){
    return Promise.reject(error)
  }
}