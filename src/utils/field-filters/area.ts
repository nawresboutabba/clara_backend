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
  try{
    if(area) {
      const { areaId, name } = area
      return ({
        area_id: areaId,
        name
      })
    }
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArrayAreaFilter =  async (area: Array<AreaI>): Promise<Array<AreaResponse>> => {
  try{
    const arrayArea: Array<Promise<AreaResponse>>= []
    if(!area){
      return []
    }
    area.forEach(area => {
      arrayArea.push(genericAreaFilter(area))
    })
    return await Promise
      .all(arrayArea)
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