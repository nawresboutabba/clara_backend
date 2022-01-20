import { PARTICIPATION_MODE } from "../../constants";
import { SolutionResponse } from "../../controller/solution";
import { TeamResponse } from "../../controller/team";
import { UserResponse } from "../../controller/users";
import { SolutionI } from "../../models/situation.solutions";
import { genericArrayAreaFilter } from "./area";
import { genericTeamFilter } from "./team";
import { genericArrayUserFilter, genericUserFilter } from "./user";

export const genericSolutionFilter = async(solution: SolutionI ): Promise<SolutionResponse> => {
    return new Promise(async (resolve, reject)=> {
        const {
            solutionId,
            created,
            status,
            updated,
            title,
            description,
            images,
            WSALevel,
            fileComplementary,
            isPrivate,
            timeInPark,
            reactions,
            challengeId,
            participationModeChoosed
        } = solution

        let coauthor : UserResponse[]
        let team : TeamResponse
        if(solution.participationModeChoosed == PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
            coauthor = await genericArrayUserFilter(solution.coauthor)
        }else if (solution.participationModeChoosed == PARTICIPATION_MODE.TEAM){
            team = await genericTeamFilter(solution.team)
        }
        const author = await genericUserFilter(solution.author)
        const inserted_by = await genericUserFilter(solution.insertedBy)
        const areasAvailable = await genericArrayAreaFilter(solution.areasAvailable)
        return resolve({
            inserted_by,
            author,
            coauthor,
            team,
            solution_id:solutionId,
            created,
            status,
            updated,
            title,
            description,
            images,
            WSALevel,
            file_complementary: fileComplementary,
            is_private: isPrivate,
            time_in_park: timeInPark,
            reactions,
            challenge_id:challengeId,
            areas_available: areasAvailable,
            participation_mode_choosed: participationModeChoosed            
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