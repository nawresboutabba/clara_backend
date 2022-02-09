import { UserI } from "../models/users";
import SolutionService from "../services/Solution.service";

export const getParticipations = (user: UserI)=> {
    return new Promise(async(resolve, reject)=> {
        try{
            const solutions = await SolutionService.getParticipations(user)
            return resolve(solutions)
        }catch(error){
            return reject(error)
        }
    })
}