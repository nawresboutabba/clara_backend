import { TeamResponse } from "../controller/team";
import TeamService from "../services/Team.service";
import UserService from "../services/User.service";
import { genericUserFilter, genericArrayUserFilter } from "../utils/field-filters/user";
import { nanoid } from 'nanoid'


/**
 * Function that create a new Team for a solution's challenge.
 * An user can have just one participation for challenge. Check This.
 * An user can have multiples participations in free solutions. 
 * @param creator 
 * @param integrants 
 * @param name 
 * @returns 
 */
export const newTeam = async (creator: string, members: Array<string>, teamName: string): Promise<TeamResponse> => {
    return new Promise(async (resolve, reject)=> {
        try{
            /**
             * @TODO Check that the user can have just one participation for challenge
             */
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
}