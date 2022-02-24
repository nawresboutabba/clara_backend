import TeamService from "../services/Team.service";
import { nanoid } from 'nanoid'
import { UserI } from "../models/users";
import { TeamI } from "../models/team";


/**
 * Function that create a new Team for a solution's challenge.
 * An user can have just one participation for challenge. Check This.
 * An user can have multiples participations in free solutions. 
 * @param creator 
 * @param integrants 
 * @param name 
 * @returns 
 */

export const newTeam = async (creator: UserI, name: string): Promise<TeamI> => {
	return new Promise(async (resolve, reject)=> {
		try{

			const newTeam: TeamI = {
				teamId: nanoid(),
				creator,
				created: new Date(),
				name
			}
			const team = await TeamService.newTeam(newTeam)
			return resolve(team)
		}catch(error){
			return reject(error)
		}
	})
} 