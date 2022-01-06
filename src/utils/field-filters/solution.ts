import { SolutionResponse } from "../../controller/solution";
import { SolutionI } from "../../models/situation.solutions";
import { genericUserFilter } from "./user";

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
            reactions
        } = solution

        const author = await genericUserFilter(solution.author)

        return resolve({
            author,
            solutionId,
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
            reactions            
        })
    })
}