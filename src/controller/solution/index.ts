import { Post, Controller, Route, Body, Delete, Path, Get, Request, Query, Inject, Patch } from 'tsoa'
import { RESOURCE } from '../../constants';
import { BaremoI } from '../../models/baremo';
import { ConfigurationBaseI } from '../../models/configuration.default';
import { CommentI } from '../../models/interaction.comment';
import { ChallengeI } from '../../models/situation.challenges';
import { SolutionI } from '../../models/situation.solutions';
import { UserI } from '../../models/users';
import { setDefaultConfiguration } from '../../repository/repository.configuration-challenge';
import { editBaremo, getCurrent, getInvitations, getSolutionComments, listSolutions, newBaremo, newEvaluationNote, newInvitation, newSolutionComment, responseInvitation } from '../../repository/repository.solution';
import { newSolution, deleteSolution, getSolution } from '../../repository/repository.solution';
import { BaremoResponse } from '../baremo';
import { ChallengeResponse, LightChallengeResponse } from '../challenge';
import { CommentBody, CommentResponse } from '../comment';
import { ConfigurationBody } from '../configuration';
import { LightSituationResponse, SituationBody, SituationResponse } from '../situation/situation';
import { UserResponse } from '../users';

export interface SolutionBody extends SituationBody {
  proposed_solution: string;
  /**
   * Participation defines the type of intervention 
   * that the creator chose to make the proposal.
   * - It can be TEAM: then the creator plus the guests, form a team
   * - It can be INDIVIDUAL_WITH_COAUTHORSHIP: then the creator will be the author and the guests will be co-authors
   * the interpretation depends on the value in chosen_mode
   */
  participation: {
    /**
     * ParticipationModeChosed
     */
    chosed_mode: string,
    creator: string,
    guest: Array<string>
    /**
     * is used if the modality is equal to TEAM
     */
    team_name?: string
  }
}

export interface SolutionResponse extends SituationResponse {
  solution_id: string,
  proposed_solution: string,
  /**
   * challenge associated
   */
  challenge_id?: string,
  challenge?: ChallengeResponse,
}

export interface LightSolutionResponse extends LightSituationResponse {
  solution_id: string,
  proposed_solution: string,
  challenge_id?: string,
  challenge?: LightChallengeResponse,
}


export interface EvaluationNoteResponse {
  note_id: string,
  solution: LightSolutionResponse,
  user: UserResponse,
  title: string,
  description:string,
  created: Date,
  updated: Date,
}

@Route('solution')
export default class SolutionController extends Controller {

  /**
   * Add new solution. It´s associated to Free challenge
   * @param body 
   * @param user 
   * @param utils 
   * @param challenge 
   * @returns 
   */

  @Post()
  public async newSolution(@Body() body: SolutionBody, @Request() user: UserI, @Inject() utils: any, @Inject() challenge: ChallengeI): Promise<SolutionResponse> {
    return newSolution(body, user, utils, challenge)
  }
  
  @Delete(':solutionId')
  public async deleteSolution(@Path('solutionId') solutionId: string, @Inject() user:UserI): Promise<boolean> {
    return deleteSolution(solutionId, user)
  }
  @Get(':solutionId')
  public async getSolution(@Path('solutionId') solutionId: string, @Request() solution: SolutionI, @Inject() user: UserI): Promise<SolutionResponse> {
    return getSolution(solutionId, solution, user)
  }

  /**
   * Solutions Listing without challenge associated
   *  
   * @param query 
   * @returns 
   */
  @Get()
  public async listSolutions(@Query() query?: any): Promise<LightSolutionResponse[]> {
    return listSolutions(query)
  }
  @Post('/default-configuration')
  public async setSolutionDefaultConfiguration(@Body() body: ConfigurationBody): Promise<ConfigurationBaseI> {
    return setDefaultConfiguration(body, RESOURCE.SOLUTION)
  }
  /**
   * New comment endpoint
   */
   @Post('/:solutionId/comment')
  public async newComment(@Path('solutionId') solutionId: string, @Body() comment: CommentBody,@Inject() solution: SolutionI, @Inject() user: UserI, @Inject() utils: any): Promise<CommentResponse> {
    return newSolutionComment(comment,solution, user, utils)
  }
  /**
   * Get Comment endpoint
   */
  @Get('/:solutionId/comment')
   public async listComments(@Path('solutionId') solutionId: string, @Query() query: any , @Inject() solution: SolutionI, @Inject() user: UserI): Promise<CommentI[]>{
     return getSolutionComments(solution, query, user)
   }
   /**
    * New baremo
    */
   @Post('/:solutionId/baremo/group-validator')
  public async newBaremo(@Path('solutionId') solutionId: string,@Inject() solution: SolutionI, @Inject() user: UserI, @Inject() utils: any ): Promise <BaremoResponse> {
    return newBaremo(solution, user, utils)
  }
  /**
   * Get current Baremo for user X solution X version
   */
  @Get('/:solutionId/baremo/group-validator/current')
   public async getCurrent(@Path('solutionId') solutionId: string, solution: SolutionI, @Inject() user: UserI):Promise <BaremoResponse | void> {
     return getCurrent (solution, user)
   }

  @Patch('/:solutionId/baremo/:baremoId')
  public async editBaremo(@Path('baremoId') baremoId: string ,@Body() data: any, @Inject() baremo: any, ): Promise<BaremoI> {
    return editBaremo(baremo, data)
  }
  /**
   * Evaluation note insert
   */
   @Post('/:solutionId/evaluation-note')
  public async evaluationNote(@Path('solutionId') solutionId: string, @Body() data: any, @Inject() solution: SolutionI, @Inject() user: UserI ): Promise <EvaluationNoteResponse> {
    return newEvaluationNote(data, solution, user)
  }
  /**
   * Create a invitation
   */
  @Post('/:solutionId/invitation')
   public async newInvitation(@Path('solutionId') solutionId: string, @Body() data: any, @Inject() user: UserI, @Inject() solution: SolutionI): Promise<any> {
     return newInvitation(user, solution)
   }
   /**
    * Get invitations
    */
   @Get('/:solutionId/invitation')
  public async getInvitations(@Path('solutionId') solutionId: string, @Query() query: any, @Inject() solution: SolutionI,  @Inject() utils: any):Promise<any> {
    return getInvitations(solution, query, utils)
  }
    /**
     * Response invitation
     */
    @Post('/:solutionId/invitation/:invitationId/response')
   public async responseInvitation(@Path('solutionId') solutionId: string, @Path('invitationId') invitationId: string, @Body() data: any,@Inject() utils: any, ): Promise<any> {
     return responseInvitation(utils.invitation, data.response)
   }
}