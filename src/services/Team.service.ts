import { UserI } from "../models/users";
import Team, { TeamI } from "../models/team";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

const TeamService = {
    async newTeam (team: TeamI): Promise<TeamI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const teamResp = await Team.create(team)
                return resolve(teamResp)
            }catch(error){
                return reject(error)
            }

            
        })
    },
    async getTeamById(teamId: string): Promise<TeamI> {
        return new Promise(async (resolve, reject)=> {
            await Team
            .findOne({teamId: teamId})
            .then(result => {
                return resolve(result)
            })
            .catch(error=> {
                // @TODO set error
                return reject(error)
            })
        })
    },
    async getTeamByName(name: string): Promise<TeamI> {
        return new Promise (async (resolve, reject)=> {
            await Team
            .findOne({name: name})
            .then(result => {
                return resolve(result)
            })
            .catch(error=> {
                return reject(new ServiceError(
                    ERRORS.SERVICE.GET_TEAM_BY_NAME,
                    HTTP_RESPONSE._500,
                    error
                ))
            })
        })
    },
    async getTeamsUser(user: UserI): Promise<TeamI[]> {
        return new Promise(async (resolve, reject)=> {
            await Team
            .find({
                $or:[
                    {
                        creator: user
                    },
                    {
                        members: {$in: user}
                    }
                ]
            })
            .then(result => {
                return resolve(result)
            })
            .catch(error=> {
                return reject(new ServiceError(
                    ERRORS.SERVICE.GET_USER_TEAMS_PARTICIPATIONS,
                    HTTP_RESPONSE._500,
                    error
                ))
            })
        })
    }
}

export default TeamService