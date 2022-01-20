import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { TeamI } from '../../models/team'
import { newTeam } from '../../repository/repository.team'
import { UserResponse } from '../users'


export interface TeamBody {
    creator: string,
    members: Array<string>,
    name: string
}

export interface TeamResponse {
    team_id: string,
    creator: UserResponse,
    members?: Array<UserResponse>,
    name: string,
    created: Date
}
/**
 * Team controller
 */
@Route('team')
export default class TeamController extends Controller {
    /**
     * Create a new Team for a challenge or situation
     * @param body 
     * @returns
     */
    @Post()
    public async newTeam(@Body() body: TeamBody): Promise<any>{
        /**
         * @TODO check endpoint
         */
        /* return newTeam(body.creator , body.name) */
        return true
    }
}