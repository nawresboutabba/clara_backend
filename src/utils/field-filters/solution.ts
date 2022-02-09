import { PARTICIPATION_MODE } from "../../constants";
import { SolutionResponse } from "../../controller/solution";
import { TeamResponse } from "../../controller/team";
import { UserResponse } from "../../controller/users";
import { SolutionI } from "../../models/situation.solutions";
import { genericArrayAreaFilter } from "./area";
import { lightTeamFilter } from "./team";
import { genericArrayUserFilter, genericUserFilter } from "./user";

export const genericSolutionFilter = async(solution: SolutionI ): Promise<SolutionResponse> => {  
  return new Promise(async (resolve, reject)=> {
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
            externalContributionAvailableForCommittee
        } = solution

        let coauthor : UserResponse[]
        let team : TeamResponse
        if(solution.participationModeChosed == PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
            coauthor = await genericArrayUserFilter(solution.coauthor)
        }else if (solution.participationModeChosed == PARTICIPATION_MODE.TEAM){
            team = await lightTeamFilter(solution.team)
        }
        const author = await genericUserFilter(solution.author)
        const inserted_by = await genericUserFilter(solution.insertedBy)
        const areasAvailable = await genericArrayAreaFilter(solution.areasAvailable)
        const departmentAffected = await genericArrayAreaFilter(solution.departmentAffected)
        return resolve({
            inserted_by,
            author,
            coauthor,
            team,
            active,
            solution_id:solutionId,
            challenge_id:challengeId,
            created,
            status,
            updated,
            file_complementary:fileComplementary,
            title,
            description,
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
        })
    })
}
export const genericArraySolutionsFilter = async(solutions : Array<SolutionI>):Promise<Array<SolutionResponse>>=> {
    return new Promise (async (resolve, reject)=> {
        let arraySolution: Array<Promise<SolutionResponse>>= []
        solutions.forEach(solution => {
            arraySolution.push(genericSolutionFilter(solution))
        })
        await Promise
        .all(arraySolution)
        .then(result => {
            return resolve(result)
        })
        .catch(error=> {
            return reject(error)
        })
    })
}
