import { TeamResponse } from "../../controller/team";
import { TeamI } from "../../models/team";

export const genericTeamFilter = async (team: TeamI): Promise<TeamResponse> => {
  const {
    teamId,
    created,
    name,
  } = team
  return {
    team_id: teamId,
    created,
    name,
  }
}

export const lightTeamFilter = async (team: TeamI): Promise<any> => {
  const {
    teamId,
    name,
  } = team
  return {
    team_id: teamId,
    name,
  }
}