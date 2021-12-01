import { Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { TYPE_CHALLENGE } from '../../models/challenges';
import { UserRequest } from '../users';
import { newChallenge, getChallenge, updateChallengePartially, deleteChallenge } from '../../repository/challenge';
import { TYPE_SOLUTION } from '../../models/solutions';
import { newSolution } from '../../repository/solution'

export interface ChallengeBody {
    challengeId:string,
    created: Date,
    updated?:Date,
    time_period?: number, 
    description: string,
    active: boolean,
    images: Array<string>,
    timePeriod: number,
    status: string,
    work_space_available?: Array<string>,
    validators: Array<string>,
    referrer: string,
    workSpaceAvailable: Array<string>
}

@Route('challenge')
export default class ChallengeController extends Controller {
    @Post()
    public async newChallenge(@Body() body:ChallengeBody, @Request() user: UserRequest): Promise<TYPE_CHALLENGE> {
        return newChallenge(body, user)
    }
    @Post(':challengeId/solution')
    public async newSolution(@Body() body: ChallengeBody, @Request() user: UserRequest, @Path('challengeId') challengeId: string): Promise<TYPE_SOLUTION>{
        return newSolution(body, user, challengeId)
    }
    @Get(':challengeId')
    public async getChallenge(@Request() challenge: TYPE_CHALLENGE, @Path('challengeId') challengeId: string): Promise<TYPE_CHALLENGE> {
        return getChallenge(challenge, challengeId)
    }
    @Patch(':challengeId')
    public async updateChallengePartially(@Body() body:ChallengeBody, @Path('challengeId') challengeId: string): Promise<TYPE_CHALLENGE> {
        return updateChallengePartially(body, challengeId)
    }
    @Delete(':challengeId')
    public async deleteChallenge(challengeId: string): Promise<boolean>{
        return deleteChallenge(challengeId)
    } 
}