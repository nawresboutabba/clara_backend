import { UserResponse } from "../../controller/users";
import { UserI } from "../../models/users";
import { genericArrayAreaFilter } from "./area";

/**
 * User information filter. 
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param user 
 * @returns 
 */
export const genericUserFilter = async (user: UserI): Promise<UserResponse> => {
	try{
		if(user) {
			const { areaVisible, externalUser, active, points, firstName, lastName , email, username} = user
			const area_visible = await genericArrayAreaFilter(areaVisible)
			return {
				area_visible,
				external_user: externalUser,
				active, 
				points,
				first_name:firstName, 
				last_name: lastName, 
				email, 
				username 
			}      
		}
		return undefined
	}catch(error){
		return Promise.reject(error)
	}
}

export const genericArrayUserFilter =  async (users: Array<UserI>): Promise<Array<UserResponse>> => {
	try{
		const arrayUser: Array<Promise<UserResponse>>= []
		if (!users){
			return []
		}
		users.forEach(user => {
			arrayUser.push(genericUserFilter(user))
		})
		await Promise
			.all(arrayUser)
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

export const lightUserFilter =  (user: UserI): any=> {
	return ({
		user_id: user._id,
		username: user.username,
		email: user.email,
		first_name: user.firstName,
		last_name: user.lastName,
		points: user.points,
	})
}