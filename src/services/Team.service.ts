import Team, { TeamI } from "../models/team";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

const TeamService = {
  async newTeam(team: TeamI): Promise<TeamI> {
    const teamResp = await Team.create(team);
    return teamResp.toObject();
  },
  async getTeamById(teamId: string): Promise<TeamI> {
    const result = await Team.findOne({ teamId: teamId });
    return result.toObject();
  },
  async getTeamByName(name: string): Promise<TeamI> {
    try {
      const result = await Team.findOne({ name: name });
      return result.toObject();
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_TEAM_BY_NAME,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};

export default TeamService;
