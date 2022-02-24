import { TeamResponse } from "../../controller/team";
import { TeamI } from "../../models/team";
import { genericArrayUserFilter, genericUserFilter } from "./user";

export const genericTeamFilter= async (team: TeamI): Promise<TeamResponse> => {
	return new Promise(async (resolve, reject)=> {
		const {
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

export const lightTeamFilter = async (team: TeamI): Promise<any> => {
	return new Promise(async (resolve, reject)=> {
		const {
			teamId,
			name,
		} = team
		return resolve({
			team_id: teamId,
			name,
		})
	})
}