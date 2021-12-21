import { Query , Post , Controller, Route, Body, Delete , Path, Patch, Get , Request} from 'tsoa'
import { ChallengeI } from '../../models/situation.challenges';
import { SolutionI } from "../../models/situation.solutions";
import { UserRequest } from '../users';
import { newChallenge, getChallenge, updateChallengePartially, deleteChallenge, listSolutions } from '../../repository/repository.challenge';
import { newSolution } from '../../repository/repository.solution'

/**
 * Data that can be edited or inserted. Other are edited by 
 * another endpoints
 */
export interface ChallengeBody {
    title: string,
    description: string,
    images: Array<string>,
    WSALevel: "COMPANY" | "AREA",
    /**
     * groupValidatorId
     */
    group_validator_id?: string
    is_strategic: boolean,
    file_complementary: string
}

@Route('challenge')
export default class ChallengeController extends Controller {
    /**
     * New Challenge method
     * @param body Challenge definition according to ChallengeBody
     * @param user User that insert the challenge
     * @returns 
     */
    @Post()
    public async newChallenge(@Body() body:ChallengeBody, @Request() user: UserRequest): Promise<ChallengeI> {
        return newChallenge(body, user)
    }
    @Post(':challengeId/solution')
    public async newSolution(@Body() body: ChallengeBody, @Request() user: UserRequest, @Path('challengeId') challengeId: string): Promise<SolutionI>{
        return newSolution(body, user, challengeId)
    }
    @Get(':challengeId')
    public async getChallenge(@Request() challenge: ChallengeI, @Path('challengeId') challengeId: string): Promise<ChallengeI> {
        return getChallenge(challenge, challengeId)
    }
    @Patch(':challengeId')
    public async updateChallengePartially(@Body() body:ChallengeBody, @Path('challengeId') challengeId: string): Promise<ChallengeI> {
        return updateChallengePartially(body, challengeId)
    }
    @Delete(':challengeId')
    public async deleteChallenge(challengeId: string): Promise<boolean>{
        return deleteChallenge(challengeId)
    } /**
     * listing solution's challenge
     * @param challengeId challenge for listing
     * @param init first document order
     * @param offset document per page
     * @returns 
     */
    @Get(':challengeId/solution')
    public async listSolutions(
        @Path('challengeId') challengeId: string, 
        @Query() init?: number,
        @Query() offset?:number,
        ): Promise<SolutionI []> {
        return listSolutions(challengeId)
    }
}