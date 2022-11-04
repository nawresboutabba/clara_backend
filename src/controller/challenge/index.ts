import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Path,
  Post,
  Query,
  Route,
} from "tsoa";
import { RESOURCE } from "../../constants";
import { ConfigurationDefaultI } from "../../models/configuration.default";
import { UserI } from "../../routes/users/user.model";
import {
  acceptChallengeProposal,
  getChallengeProposal,
  listChallengeProposal,
  newChallengeProposal,
  updateChallengePartially,
} from "../../repository/repository.challenge";
import {
  getChallengeConfiguration,
  setDefaultConfiguration,
} from "../../repository/repository.configuration-challenge";
import { GroupValidatorResponse } from "../../repository/repository.group-validator";
import {
  createSolution,
  listSolutions,
  updateSolution,
} from "../../repository/repository.solution";
import {
  ChallengeI,
  CHALLENGE_TYPE,
  CHALLENGE_TYPE_TYPE,
  IDEA_BEHAVIOR_ENUM,
} from "../../routes/challenges/challenge.model";
import { LightStrategicAlignmentSerialized } from "../../routes/strategic-alignments/strategic-alignment.serializer";
import { ConfigurationBody } from "../configuration";
import { SituationBody, SituationResponse } from "../situation/situation";
import { LightSolutionResponse, SolutionResponse } from "../solutions";
import { AreaSerialized } from "../../routes/area";
/**
 * Data that can be edited or inserted. Other are edited by
 * another endpoints
 */
export interface ChallengeBody extends SituationBody {
  /**
   * GENERIC | PARTICULAR
   */
  type: CHALLENGE_TYPE;
  /**
   * author is required for a challenge creation
   */
  author: string;
  /**
   * Required for challenge
   */
  group_validator: string;
  finalization: Date;
  default_scope: boolean;
}
export interface LightChallengeResponse {
  id: string;
  created: Date;
  status: string;
  title: string;
  description: string;
  active: boolean;
  banner_image: string;
  images: string[];
  finalization: Date;
  areas_available: AreaSerialized[];
  department_affected: AreaSerialized[];
  type: CHALLENGE_TYPE_TYPE;
  idea_behavior: IDEA_BEHAVIOR_ENUM;

  group_validator: GroupValidatorResponse;
  interactions: {
    interaction: string;
    count: number;
  };
}

export interface ChallengeResponse extends SituationResponse {
  id: string;
  finalization: Date;
  // default_scope: boolean;
  group_validator: GroupValidatorResponse;
  strategic_alignment: LightStrategicAlignmentSerialized;
  idea_behavior: IDEA_BEHAVIOR_ENUM;
  type: string;
  interactions?: {
    interaction: string;
    count: number;
  };
}

export interface ChallengeProposalResponse extends ChallengeResponse {
  proposal_id: string;
  date_proposal: Date;
}

@Route("challenge")
export default class ChallengeController extends Controller {
  @Post("/default-configuration")
  public async setChallengeDefaultConfiguration(
    @Body() body: ConfigurationBody
  ): Promise<ConfigurationDefaultI> {
    return setDefaultConfiguration(body, RESOURCE.CHALLENGE);
  }
  @Get("/default-configuration")
  public async getChallengeDefaultConfiguration(): Promise<ConfigurationDefaultI> {
    return getChallengeConfiguration();
  }
  @Get("/proposal")
  public async listChallengeProposal(
    @Query() query: any
  ): Promise<ChallengeProposalResponse[]> {
    return listChallengeProposal(query);
  }
  @Get("/proposal/:proposalId")
  public async getChallengeProposal(
    @Path("proposalId") proposalId: string
  ): Promise<any> {
    return getChallengeProposal(proposalId);
  }
  @Post("/proposal/:proposeId/accept")
  public async acceptChallengeProposal(
    @Path("proposeId") proposeId: string
  ): Promise<any> {
    return acceptChallengeProposal(proposeId);
  }
  /**
   * New Challenge Proposal method
   * @param body Challenge definition according to ChallengeBody
   * @param user User that insert the challenge
   * @returns
   */
  @Post("/proposal")
  public async newChallengeProposal(
    @Body() body: ChallengeBody,
    @Inject() user: UserI,
    @Inject() utils: any
  ): Promise<ChallengeResponse> {
    return newChallengeProposal(body, user, utils);
  }

  @Post(":challengeId/solution")
  public async newSolution(
    @Inject() user: UserI,
    @Inject() utils: any,
    @Inject() challenge: ChallengeI
  ): Promise<SolutionResponse> {
    return createSolution(user, utils, challenge);
  }

  /**
   * listing solution's challenge
   * @param challengeId challenge for listing
   * @param init first document order
   * @param offset document per page
   * @returns
   */
  @Get(":challengeId/solution/")
  public async listSolutions(
    @Path("challengeId") challengeId: string,
    @Query() query: any
  ): Promise<LightSolutionResponse[]> {
    return listSolutions(query);
  }

  @Patch(":challengeId/solution/:solutionId")
  public async updateSolution(
    @Path("challengeId") challengeId: string,
    @Path("solutionId") solutionId: string,
    @Body() body: any,
    @Inject() resources: any,
    @Inject() user: UserI,
    @Inject() utils: any
  ): Promise<any> {
    return updateSolution(body, resources, user, utils);
  }

  @Patch(":challengeId")
  public async updateChallengePartially(
    @Body() body: ChallengeBody,
    @Path("challengeId") challengeId: string
  ): Promise<ChallengeI> {
    return updateChallengePartially(body, challengeId);
  }
}
