import TeamService from "../services/Team.service";
import { nanoid } from 'nanoid'
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

export const newTeam = async (name: string): Promise<TeamI> => {
  try {

    const newTeam: TeamI = {
      teamId: nanoid(),
      created: new Date(),
      name
    }
    const team = await TeamService.newTeam(newTeam)
    return team
  } catch (error) {
    return Promise.reject(error)
  }
} 