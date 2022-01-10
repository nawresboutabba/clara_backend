import { AreaResponse } from "../../controller/area/area";
import { AreaI } from "../../models/organization.area";


/**
 * Area information filter. 
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param area 
 * @returns 
 */
export const genericAreaFilter = async (area: AreaI): Promise<AreaResponse> => {
    return new Promise((resolve, reject)=> {
        if(area) {
            const { name } = area
            return resolve({
                name
            })            
        }
        return resolve(undefined)

    })
}

export const genericArrayAreaFilter =  async (area: Array<AreaI>): Promise<Array<AreaResponse>> => {
    return new Promise(async (resolve, reject)=> {
        let arrayArea: Array<Promise<AreaResponse>>= []

        area.forEach(area => {
            arrayArea.push(genericAreaFilter(area))
        })
        await Promise
        .all(arrayArea)
        .then(result => {
            return resolve(result)
        })
        .catch(error=> {
            return reject(error)
        })
    })
}