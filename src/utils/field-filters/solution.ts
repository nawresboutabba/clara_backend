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
            reactions,
            challengeId
        } = solution

        const author = await genericUserFilter(solution.author)
        const inserted_by = await genericUserFilter(solution.insertedBy)
        return resolve({
            inserted_by,
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
            reactions,
            challengeId            
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