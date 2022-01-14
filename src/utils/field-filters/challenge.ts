import { ChallengeResponse } from "../../controller/challenge";
import { ChallengeI } from "../../models/situation.challenges";
import { genericAreaFilter, genericArrayAreaFilter } from "./area";
import { genericUserFilter } from "./user";

/**
 * Challenge information filter. 
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param challenge 
 * @returns 
 */

export const genericChallengeFilter = async (challenge : ChallengeI): Promise<ChallengeResponse> => {
    return new Promise(async (resolve, reject)=> {
        const { 
            created,
            title, 
            description , 
            status, 
            updated,
            images,
            WSALevel,
            fileComplementary,
            isStrategic,
            timePeriod,
            participationMode,
            reactions,
            challengeId
        } = challenge
        const author = await genericUserFilter(challenge.author)
        const inserted_by = await genericUserFilter(challenge.insertedBy)
        const areasAvailable = await genericArrayAreaFilter(challenge.areasAvailable)
        return resolve({
            challenge_id: challengeId,
            inserted_by,
            author,
            created,
            title, 
            description , 
            status, 
            updated,
            images,
            WSALevel,
            file_complementary: fileComplementary,
            is_strategic: isStrategic,
            time_period: timePeriod,
            participation_mode: participationMode,
            reactions,
            areas_available: areasAvailable
        })
    })
}

export const genericArrayChallengeFilter = async (challenges: Array<ChallengeI>): Promise<Array<ChallengeResponse>> =>  {
    return new Promise(async (resolve, reject)=> {
        let arrayChallenge: Array<Promise<ChallengeResponse>>= []
        challenges.forEach(challenge => {
            arrayChallenge.push(genericChallengeFilter(challenge))
        })
        await Promise
        .all(arrayChallenge)
        .then(result => {
            return resolve(result)
        })
        .catch(error=> {
            return reject(error)
        })        
    })
}