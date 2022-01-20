import { TeamResponse } from "../controller/team";
import TeamService from "../services/Team.service";
import UserService from "../services/User.service";
import { genericUserFilter, genericArrayUserFilter } from "../utils/field-filters/user";
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
/* export const newTeam = async (creator: string, members: Array<string>, teamName: string): Promise<TeamResponse> => {
    return new Promise(async (resolve, reject)=> {
        try{
            const creatorUser = await UserService.getUserActiveByUserId(creator)
            const membersUser = await UserService.getUsers(members)
            const id = nanoid()
            const team = await TeamService.newTeam(creatorUser, membersUser, teamName, id)
        
            const {name, created, teamId} = team

            const integrantsFiltered = await genericArrayUserFilter(team.members)
            const creatorFiltered = await genericUserFilter(team.creator)

            return resolve({
                team_id: teamId,
                name, 
                created, 
                members: integrantsFiltered,
                creator: creatorFiltered
            })
        }catch(error){
            return reject(error)
        }
    })
} */

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