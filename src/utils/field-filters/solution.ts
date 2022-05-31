import { CHALLENGE_TYPE } from "../../constants";
import { LightSolutionResponse, SolutionResponse } from "../../controller/solution";
import { UserResponse } from "../../controller/users";
import { SolutionI } from "../../models/situation.solutions";
import { getArrayImageSignedUrl, getSignedUrl } from "../../repository/repository.image-service";
import { genericArrayAreaFilter } from "./area";
import { lightChallengeFilter } from "./challenge";
import { genericArrayTagsFilter } from "./tag";
import { genericArrayUserFilter, genericUserFilter } from "./user";

export const genericSolutionFilter = async(solution: SolutionI ): Promise<SolutionResponse> => {  
  const {
    solutionId,
    challengeId,
    created,
    status,
    updated,
    title,
    description,
    active,
    fileComplementary,
    bannerImage,
    images,
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
    proposedSolution
  } = solution

  const coauthor : UserResponse[] = await genericArrayUserFilter(solution.coauthor)

  const author = await genericUserFilter(solution.author)
  const inserted_by = await genericUserFilter(solution.insertedBy)
  const areasAvailable = await genericArrayAreaFilter(solution.areasAvailable)
  const departmentAffected = await genericArrayAreaFilter(solution.departmentAffected)
  const tags = await genericArrayTagsFilter(solution.tags)
  const challenge = await lightChallengeFilter(solution.challenge)


  return {
    inserted_by,
    author,
    coauthor,
    active,
    solution_id:solutionId,
    challenge_id: solution.challenge.type == CHALLENGE_TYPE.PARTICULAR? challengeId : undefined,
    challenge,
    created,
    status,
    updated,
    tags,
    file_complementary:fileComplementary,
    title,
    description,
    proposed_solution: proposedSolution,
    banner_image: bannerImage,
    images,
    department_affected:departmentAffected,
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
    areas_available: areasAvailable,
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
  }
}


export const lightSolutionFilter = async (solution : SolutionI): Promise<LightSolutionResponse> => {
  
  const images = await getArrayImageSignedUrl(solution.images)
  const banner_image = await getSignedUrl(solution.bannerImage)
  const inserted_by = await genericUserFilter(solution.insertedBy)

  const challenge = {
    type: solution.challenge.type,
    challenge_id: solution.challenge.challengeId,
    title: solution.challenge.title,
    description: solution.challenge.description,
  }



  return ({
    solution_id: solution.solutionId,
    inserted_by,
    title: solution.title,
    description: solution.description,
    proposed_solution: solution.proposedSolution,
    created: solution.created,
    status: solution.status,
    banner_image,
    images,
    challenge
  })
}


export const genericArraySolutionsFilter = async(solutions : Array<SolutionI>):Promise<Array<LightSolutionResponse>>=> {
  const arraySolution: Array<Promise<LightSolutionResponse>>= []
  solutions.forEach(solution => {
    arraySolution.push(lightSolutionFilter(solution))
  })
  return await Promise
    .all(arraySolution)
    .then(result => {
      return result
    })
    .catch(error=> {
      return Promise.reject(error)
    })
}
