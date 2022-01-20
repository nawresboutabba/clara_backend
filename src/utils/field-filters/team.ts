import { TeamResponse } from "../../controller/team";
import { TeamI } from "../../models/team";
import { genericArrayUserFilter, genericUserFilter } from "./user";

export const genericTeamFilter= async (team: TeamI): Promise<TeamResponse> => {
    return new Promise(async (resolve, reject)=> {
        let {
            teamId,
            created,
            name,
        } = team
        const creator = await genericUserFilter(team.creator) 
        const members = await genericArrayUserFilter(team.members)
        return resolve({
            team_id: teamId,
            created,
            name,
            members,
            creator
        })
    })
}