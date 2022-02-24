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
			const { areaId, name } = area
			return resolve({
				area_id: areaId,
				name
			})            
		}
		return resolve(undefined)

	})
}

export const genericArrayAreaFilter =  async (area: Array<AreaI>): Promise<Array<AreaResponse>> => {
	return new Promise(async (resolve, reject)=> {
		const arrayArea: Array<Promise<AreaResponse>>= []
		if(!area){
			return resolve([])
		}
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