import { UserResponse } from "../../controller/users";
import { UserI } from "../../models/users";


/**
 * User information filter. 
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param user 
 * @returns 
 */
export const genericUserFilter = async (user: UserI): Promise<UserResponse> => {
    return new Promise((resolve, reject)=> {
        if(user) {
            const { externalUser, active, points, firstName, lastName , email, username} = user
            return resolve({
                external_user: externalUser,
                active, 
                points,
                first_name:firstName, 
                last_name: lastName, 
                email, 
                username 
            })            
        }
        return resolve(undefined)

    })
}

export const genericArrayUserFilter =  async (users: Array<UserI>): Promise<Array<UserResponse>> => {
    return new Promise(async (resolve, reject)=> {
        let arrayUser: Array<Promise<UserResponse>>= []

        users.forEach(user => {
            arrayUser.push(genericUserFilter(user))
        })
        await Promise
        .all(arrayUser)
        .then(result => {
            return resolve(result)
        })
        .catch(error=> {
            return reject(error)
        })
    })
}