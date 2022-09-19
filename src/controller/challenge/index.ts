import { Query, Post, Controller, Route, Body, Delete, Path, Patch, Get, Inject, Put } from 'tsoa'
import { ChallengeI, CHALLENGE_TYPE } from '../../models/situation.challenges';
import {


  updateChallengePartially,

  newChallengeProposal,
  getChallengeProposal,
  acceptChallengeProposal,
  listChallengeProposal,
} from '../../repository/repository.challenge';
import { listSolutions, updateSolution } from '../../repository/repository.solution';
import { createSolution } from '../../repository/repository.solution'
import { SituationBody, SituationResponse } from '../situation/situation';
import { LightSolutionResponse, SolutionBody, SolutionResponse } from '../solutions';
import { CommentBody, CommentResponse } from '../comment';
import { UserI } from '../../models/users';
import { ReactionBody, ReactionResponse } from '../reaction';
import { getChallengeConfiguration, setDefaultConfiguration } from '../../repository/repository.configuration-challenge';
import { ConfigurationBody } from '../configuration';
import { ConfigurationDefaultI } from '../../models/configuration.default';
import { RESOURCE } from '../../constants';
import { GroupValidatorResponse } from '../../repository/repository.group-validator';
import { AreaResponse } from '../area/area';
/**
 * Data that can be edited or inserted. Other are edited by 
 * another endpoints
 */
export interface ChallengeBody extends SituationBody {
  /**
   * GENERIC | PARTICULAR
   */
  type: CHALLENGE_TYPE
  /**
   * author is required for a challenge creation
   */
  author: string,
  /**
   * Challenge is strategic?
   */
  is_strategic: boolean,
  /**
   * Required for challenge
   */
  group_validator: string,
  finalization: Date,
  default_scope: boolean
}
export interface LightChallengeResponse {
  challenge_id: string;
  created: Date;
  status: string;
  title: string;
  description: string;
  active: boolean;
  banner_image: string;
  images: string[];
  is_strategic: boolean;
  finalization: Date;
  areas_available: AreaResponse[];
  department_affected: AreaResponse[];
  group_validator: GroupValidatorResponse;
  interactions: {
    interaction: string;
    count: number;
  };
  type: string;
}

export interface ChallengeResponse extends SituationResponse {
  challenge_id: string
  is_strategic: boolean,
  finalization: Date,
  default_scope: boolean,
  group_validator: GroupValidatorResponse,
  type: string,
  interactions?: {
    interaction: string,
    count: number
  }
}

export interface ChallengeProposalResponse extends ChallengeResponse {
  proposal_id: string
  date_proposal: Date,
}

@Route('challenge')
export default class ChallengeController extends Controller {
  @Post('/default-configuration')
  public async setChallengeDefaultConfiguration(@Body() body: ConfigurationBody): Promise<ConfigurationDefaultI> {
    return setDefaultConfiguration(body, RESOURCE.CHALLENGE)
  }
  @Get('/default-configuration')
  public async getChallengeDefaultConfiguration(): Promise<ConfigurationDefaultI> {
    return getChallengeConfiguration()
  }
  @Get('/proposal')
  public async listChallengeProposal(@Query() query: any): Promise<ChallengeProposalResponse[]> {
    return listChallengeProposal(query)
  }
  @Get('/proposal/:proposalId')
  public async getChallengeProposal(@Path('proposalId') proposalId: string): Promise<any> {
    return getChallengeProposal(proposalId)
  }
  @Post('/proposal/:proposeId/accept')
  public async acceptChallengeProposal(@Path('proposeId') proposeId: string): Promise<any> {
    return acceptChallengeProposal(proposeId)
  }
  /**
   * New Challenge Proposal method
   * @param body Challenge definition according to ChallengeBody
   * @param user User that insert the challenge
   * @returns 
   */
  @Post('/proposal')
  public async newChallengeProposal(@Body() body: ChallengeBody, @Inject() user: UserI, @Inject() utils: any): Promise<ChallengeResponse> {
    return newChallengeProposal(body, user, utils)
  }

  @Post(':challengeId/solution')
  public async newSolution(@Inject() user: UserI, @Inject() utils: any, @Inject() challenge: ChallengeI): Promise<SolutionResponse> {
    return createSolution(user, utils, challenge)
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
  ): Promise<LightSolutionResponse[]> {
    return listSolutions(query)
  }

  @Patch(':challengeId/solution/:solutionId')
  public async updateSolution(@Path('challengeId') challengeId: string, @Path('solutionId') solutionId: string, @Body() body: any, @Inject() resources: any, @Inject() user: UserI, @Inject() utils: any): Promise<any> {
    return updateSolution(body, resources, user, utils)
  }

  @Patch(':challengeId')
  public async updateChallengePartially(@Body() body: ChallengeBody, @Path('challengeId') challengeId: string): Promise<ChallengeI> {
    return updateChallengePartially(body, challengeId)
  }
}
