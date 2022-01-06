import { ChallengeResponse } from "../../controller/challenge";
import { ChallengeI } from "../../models/situation.challenges";

/**
 * Challenge information filter. 
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param challenge 
 * @returns 
 */

export const genericChallengeFilter = async (challenge : ChallengeI): Promise<ChallengeResponse> => {
    return new Promise((resolve, reject)=> {
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
            reactions
        } = challenge

        return resolve({
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
            reactions
        })
    })
}