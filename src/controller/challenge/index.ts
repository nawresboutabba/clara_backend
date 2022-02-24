import { Query , Post , Controller, Route, Body, Delete , Path, Patch, Get , Request, Inject} from 'tsoa'
import { ChallengeI } from '../../models/situation.challenges';
import { UserRequest } from '../users';
import { 
	newChallenge, 
	getChallenge, 
	updateChallengePartially, 
	deleteChallenge, listChallenges, 
	newChallengeComment, 
	getComments, 
	newReaction, 
	newChallengeProposal, 
	getChallengeProposal, 
	acceptChallengeProposal, 
	listChallengeProposal} from '../../repository/repository.challenge';
import { listSolutions } from '../../repository/repository.solution';
import { newSolution } from '../../repository/repository.solution'
import { SituationBody, SituationResponse } from '../situation/situation';
import { SolutionBody, SolutionResponse } from '../solution';
import { CommentBody, CommentResponse } from '../comment';
import { UserI } from '../../models/users';
import { ReactionBody, ReactionResponse } from '../reaction';
import { getChallengeConfiguration, setDefaultConfiguration } from '../../repository/repository.configuration-challenge';
import { ConfigurationBody } from '../configuration';
import { ConfigurationDefaultI } from '../../models/configuration.default';
import { RESOURCE } from '../../constants';
import { GroupValidatorResponse } from '../../repository/repository.group-validator';
/**
 * Data that can be edited or inserted. Other are edited by 
 * another endpoints
 */
export interface ChallengeBody extends SituationBody {
    /**
     * author is required for a challenge creation
     */
    author: string,
    is_strategic: boolean,
    /**
     * Required for challenge
     */
    group_validator: string,
    finalization: Date
}


export interface ChallengeResponse extends SituationResponse {
    challenge_id: string
    is_strategic: boolean,
    finalization: Date,
    group_validator: GroupValidatorResponse
}

export interface ChallengeProposalResponse extends ChallengeResponse {
    proposal_id: string
    date_proposal: Date
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
    /**
     * New Challenge Proposal method
     * @param body Challenge definition according to ChallengeBody
     * @param user User that insert the challenge
     * @returns 
     */
     @Post('/proposal')
    public async newChallengeProposal(@Body() body:ChallengeBody, @Request() user: UserRequest): Promise<ChallengeResponse> {
    	return newChallengeProposal(body, user)
    }

    @Post(':challengeId/solution')
     public async newSolution(@Body() body: SolutionBody, @Request() user: UserRequest, @Path('challengeId') challengeId: string , @Inject() utils : any): Promise<SolutionResponse>{
     	return newSolution(body, user, utils,  challengeId)
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
    public async newReaction(@Path('challengeId') challengeId: string, @Body() reaction: ReactionBody, @Inject() user: UserI): Promise<ReactionResponse>{
    	return newReaction(challengeId, reaction, user)
    }
    @Post('/default-configuration')
    public async setChallengeDefaultConfiguration(@Body() body: ConfigurationBody): Promise<ConfigurationDefaultI>{
    	return setDefaultConfiguration(body, RESOURCE.CHALLENGE)
    }
    @Get('/default-configuration')
    public async getChallengeDefaultConfiguration(): Promise<ConfigurationDefaultI>{
    	return getChallengeConfiguration()
    }
    @Get('/proposal')
    public async listChallengeProposal(@Query() query: any): Promise<ChallengeProposalResponse[]>{
    	return listChallengeProposal(query)
    }
    @Get('/proposal/:proposalId')
    public async getChallengeProposal(@Path('proposalId') proposalId: string): Promise<any>{
    	return getChallengeProposal(proposalId)
    }
    @Post('/proposal/:proposeId/accept')
    public async acceptChallengeProposal(@Path('proposeId') proposeId: string): Promise<any>{
    	return acceptChallengeProposal(proposeId)
    }
}