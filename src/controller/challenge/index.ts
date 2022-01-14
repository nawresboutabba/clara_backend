import { Query , Post , Controller, Route, Body, Delete , Path, Patch, Get , Request, Inject} from 'tsoa'
import { ChallengeI } from '../../models/situation.challenges';
import { UserRequest } from '../users';
import { newChallenge, getChallenge, updateChallengePartially, deleteChallenge, listChallenges, newChallengeComment, getComments, newReaction } from '../../repository/repository.challenge';
import { listSolutions } from '../../repository/repository.solution';
import { newSolution } from '../../repository/repository.solution'
import { SituationBody, SituationResponse } from '../situation/situation';
import { SolutionResponse } from '../solution';
import { CommentBody, CommentResponse } from '../comment';
import { UserI } from '../../models/users';
import { ReactionBody, ReactionResponse } from '../reaction';
/**
 * Data that can be edited or inserted. Other are edited by 
 * another endpoints
 */
export interface ChallengeBody extends SituationBody {
    /**
     * author is required for a challenge
     */
    author: string,
    is_strategic: boolean,
    file_complementary: string,
    participation_mode: string[],
}


export interface ChallengeResponse extends SituationResponse {
    is_strategic: boolean,
    time_period: number,
    participation_mode: Array<string>,
    challenge_id: string
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
    public async newChallenge(@Body() body:ChallengeBody, @Request() user: UserRequest): Promise<ChallengeResponse> {
        return newChallenge(body, user)
    }
    @Post(':challengeId/solution')
    public async newSolution(@Body() body: ChallengeBody, @Request() user: UserRequest, @Path('challengeId') challengeId: string): Promise<SolutionResponse>{
        return newSolution(body, user, challengeId)
    }
    /**
     * Challenge listing
     * @param query 
     * @returns 
     */
    @Get()
    public async listChallenges(@Query() query: any): Promise<ChallengeResponse[]>{
        return listChallenges(query)
    }

    @Get(':challengeId')
    public async getChallenge(@Request() challenge: ChallengeI, @Path('challengeId') challengeId: string): Promise<ChallengeResponse> {
        return getChallenge(challenge)
    }

    /**
     * listing solution's challenge
     * @param challengeId challenge for listing
     * @param init first document order
     * @param offset document per page
     * @returns 
     */
     @Get(':challengeId/solution/')
     public async listSolutions(
         @Path('challengeId') challengeId: string, 
         @Query() query: any
         ): Promise<SolutionResponse []> {
         return listSolutions( query, challengeId)
     }

    @Patch(':challengeId')
    public async updateChallengePartially(@Body() body:ChallengeBody, @Path('challengeId') challengeId: string): Promise<ChallengeI> {
        return updateChallengePartially(body, challengeId)
    }
    @Delete(':challengeId')
    public async deleteChallenge(challengeId: string): Promise<boolean>{
        return deleteChallenge(challengeId)
    }
    /**
     * Challenge comment operation
     * @param challengeId Challenge
     * @param comment comment
     * @param user user that insert the comment
     * @returns 
     */
    @Post('/:challengeId/comment')
    public async newComment (@Path('challengeId') challengeId: string , @Body() comment: CommentBody, @Inject() user: UserI): Promise<CommentResponse>{
        return newChallengeComment(challengeId, comment, user)
    }
    @Get('/:challengeId/comment')
    public async getComments (@Path('challengeId') challengeId: string, @Inject() user: UserI): Promise<CommentResponse[]>{
        return getComments(challengeId, user)
    }
    /**
     * New Reacion
     * @param challengeId 
     * @param reaction 
     * @param user 
     * @returns 
     */
    @Post('/:challengeId/reaction')
    public async newReaction(@Path('challengeId') challengeId: string, reaction: ReactionBody, @Inject() user: UserI): Promise<ReactionResponse>{
        return newReaction(challengeId, reaction, user)
    }
}