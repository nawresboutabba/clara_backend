import { IntegrantResponse } from "../../controller/integrant";
import { IntegrantI } from "../../models/integrant";
import { genericUserFilter } from "./user";

export const genericIntegrantFilter = async (integrant : IntegrantI): Promise<IntegrantResponse> => {
    return new Promise(async (resolve, reject)=> {
        const {
            integrantId,
            active,
            created,
            lastChangePosition,
            finished,
            groupValidator,
            role
        } = integrant
        const user = await genericUserFilter(integrant.user)
        return resolve ({
            user,
            integrant_id: integrantId,
            active,
            created,
            last_change_position: lastChangePosition,
            finished,
            role            
        })
    })
}

export const genericArrayIntegrantFilter = async (integrants : IntegrantI[]): Promise<IntegrantResponse[]> => {
    return new Promise(async (resolve, reject)=> {
        const integrantResponse = []
        for(let i = 0; i < integrants.length; i++){
            const integrant = integrants[i]
            const integrantFiltered = await genericIntegrantFilter(integrant)
            integrantResponse.push(integrantFiltered)
        }
        return resolve(integrantResponse)
    })
}