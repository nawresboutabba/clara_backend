import { UserI } from "../models/users";
import Team, { TeamI } from "../models/team";

const TeamService = {
    async newTeam(creator: UserI, members: Array<UserI>, name: string, teamId: string): Promise<TeamI>{
        return new Promise(async (resolve, reject)=> {
            await Team
            .create({
                teamId,
                creator,
                members,
                name,
                created: new Date()
            })
            .then(result => {
                return resolve(result)
            })
            .catch(error => {
                return reject(error)
            })
        })
    }
}

export default TeamService