import { Post, Controller, Route, Body, Delete, Path, Patch, Get, Request, Query, Example, Inject } from 'tsoa'
import { RESOURCE } from '../../constants';
import { ConfigurationBaseI } from '../../models/configuration.default';
import { SolutionI } from '../../models/situation.solutions';
import { UserI } from '../../models/users';
import { setDefaultConfiguration } from '../../repository/repository.configuration-challenge';
import { listSolutions } from '../../repository/repository.solution';
import { newSolution, deleteSolution, getSolution } from '../../repository/repository.solution';
import { ChallengeResponse } from '../challenge';
import { ConfigurationBody } from '../configuration';
import { SituationBody, SituationResponse } from '../situation/situation';

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


@Route('solution')
export default class SolutionController extends Controller {
  @Post()
  public async newSolution(@Body() body: SolutionBody, @Request() user: UserI, @Inject() utils: any): Promise<SolutionResponse> {
    return newSolution(body, user, utils)
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
  public async listSolutions(@Query() query?: any): Promise<SolutionResponse[]> {
    return listSolutions(query, undefined)
  }
  @Post('/default-configuration')
  public async setSolutionDefaultConfiguration(@Body() body: ConfigurationBody): Promise<ConfigurationBaseI> {
    return setDefaultConfiguration(body, RESOURCE.SOLUTION)
  }
}