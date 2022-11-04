import { bool } from "aws-sdk/clients/signer";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Route,
} from "tsoa";
import { RESOURCE } from "../../constants";
import { ConfigurationBaseI } from "../../models/configuration.default";
import { UserI } from "../../routes/users/user.model";
import { setDefaultConfiguration } from "../../repository/repository.configuration-challenge";
import {
  applyTransition,
  createSolution,
  deleteSolution,
  getSolution,
  listSolutions,
  newEvaluationNote,
  updateSolution,
} from "../../repository/repository.solution";
import { BaremaI } from "../../routes/barema/barema.model";
import { ChallengeI } from "../../routes/challenges/challenge.model";
import { SolutionI } from "../../routes/solutions/solution.model";
import { LightStrategicAlignmentSerialized } from "../../routes/strategic-alignments/strategic-alignment.serializer";
import { TagSerialized } from "../../routes/tags/tags.serializer";

import { LightChallengeResponse } from "../challenge";
import { ConfigurationBody } from "../configuration";
import {
  LightSituationResponse,
  SituationBody,
  SituationResponse,
} from "../situation/situation";
import { UserResponse } from "../users";
import { AreaSerialized } from "../../routes/area";

export interface SolutionBody extends SituationBody {
  proposed_solution: string;
  differential: string;
  is_new_for: string;
  was_tested: bool;
  test_description: string;
  barema_type_suggested: string;
  first_difficulty: string;
  second_difficulty: string;
  third_difficulty: string;
  implementation_time_in_months: number;
  impact: string;
  money_needed: number;

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
    chosed_mode: string;
    creator: string;
    guest: Array<string>;
    /**
     * is used if the modality is equal to TEAM
     */
    team_name?: string;
  };
}

export interface SolutionResponse extends SituationResponse {
  id: string;
  proposed_solution: string;
  differential: string;
  is_new_for: string;
  was_tested: bool;
  first_difficulty: string;
  second_difficulty: string;
  third_difficulty: string;
  implementation_time_in_months: number;
  money_needed: number;
  test_description: string;
  barema_type_suggested: string;
  impact: string;
  strategic_alignment: LightStrategicAlignmentSerialized;

  /**
   * challenge associated
   */
  challenge?: LightChallengeResponse;
  is_privated: boolean;
}

export interface LightSolutionResponse extends LightSituationResponse {
  id: string;
  proposed_solution: string;
  challenge?: {
    type: string;
    id: string;
    title: string;
    description: string;
    finalization: Date;
  };
  tags: TagSerialized[];
  departmentAffected: AreaSerialized[];
  differential: string;
  is_new_for: string;
  was_tested: boolean;
  test_description: string;
  impact: string;
  implementation_time_in_months: number;
  money_needed: number;
  first_difficulty: string;
  second_difficulty: string;
  third_difficulty: string;
}

export interface EvaluationNoteResponse {
  note_id: string;
  solution: LightSolutionResponse;
  user: UserResponse;
  title: string;
  description: string;
  created: Date;
  updated: Date;
}

@Route("solution")
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
  public async newSolution(
    @Inject() user: UserI,
    @Inject() utils: any,
    @Inject() challenge: ChallengeI
  ): Promise<SolutionResponse> {
    return createSolution(user, utils, challenge);
  }
  @Patch(":solutionId")
  public async updateSolution(
    @Path("solutionId") solutionId: string,
    @Body() body: any,
    @Inject() resources: any,
    @Inject() user: UserI,
    @Inject() utils: any
  ): Promise<any> {
    return updateSolution(body, resources, user, utils);
  }

  @Delete(":solutionId")
  public async deleteSolution(
    @Path("solutionId") solutionId: string,
    @Inject() user: UserI
  ): Promise<boolean> {
    return deleteSolution(solutionId, user);
  }
  @Get(":solutionId")
  public async getSolution(
    @Path("solutionId") solutionId: string,
    @Request() solution: SolutionI,
    @Inject() user: UserI
  ): Promise<SolutionResponse> {
    return getSolution(solutionId, solution, user);
  }

  @Get()
  public async listSolutions(
    @Query() query?: any,
    @Inject() utils?: any
  ): Promise<LightSolutionResponse[]> {
    return listSolutions(query, utils);
  }
  @Post("/default-configuration")
  public async setSolutionDefaultConfiguration(
    @Body() body: ConfigurationBody
  ): Promise<ConfigurationBaseI> {
    return setDefaultConfiguration(body, RESOURCE.SOLUTION);
  }

  /**
   * New baremo
   */
  // @Post("/:solutionId/baremo/group-validator")
  // public async newBaremo(
  //   @Path("solutionId") solutionId: string,
  //   @Inject() solution: SolutionI,
  //   @Inject() user: UserI,
  //   @Inject() utils: any
  // ): Promise<BaremoResponse> {
  //   return newBaremo(solution, user, utils);
  // }
  /**
   * Get current Baremo for user X solution X version
   */
  // @Get("/:solutionId/baremo/group-validator/current")
  // public async getCurrent(
  //   @Path("solutionId") solutionId: string,
  //   solution: SolutionI,
  //   @Inject() user: UserI
  // ): Promise<BaremoResponse | void> {
  //   return getCurrent(solution, user);
  // }

  // @Patch("/:solutionId/baremo/:baremoId")
  // public async editBaremo(
  //   @Path("baremoId") baremoId: string,
  //   @Body() data: any,
  //   @Inject() baremo: any
  // ): Promise<BaremaI> {
  //   return editBaremo(baremo, data);
  // }
  /**
   * Evaluation note insert
   */
  @Post("/:solutionId/evaluation-note")
  public async evaluationNote(
    @Path("solutionId") solutionId: string,
    @Body() data: any,
    @Inject() solution: SolutionI,
    @Inject() user: UserI
  ): Promise<EvaluationNoteResponse> {
    return newEvaluationNote(data, solution, user);
  }
  /**
   * Create a invitation
   */
  @Post("/:solutionId/invitation")
  public async newInvitation(
    @Path("solutionId") solutionId: string,
    @Body() data: any,
    @Inject() utils: any,
    @Inject() solution: SolutionI
  ): Promise<any> {
    // return newInvitation(utils, solution, data.type);
  }
  /**
   * Get invitations
   */
  @Get("/:solutionId/invitation")
  public async getInvitations(
    @Path("solutionId") solutionId: string,
    @Query() query: any,
    @Inject() solution: SolutionI,
    @Inject() utils: any
  ): Promise<any> {
    // return getInvitations(solution, query, utils);
  }
  /**
   * Response invitation
   */
  @Post("/:solutionId/invitation/:invitationId/response")
  public async responseInvitation(
    @Path("solutionId") solutionId: string,
    @Path("invitationId") invitationId: string,
    @Body() data: any,
    @Inject() utils: any
  ): Promise<any> {
    // return responseInvitation(utils.invitation, data.response);
  }
  /**
   * Apply TRansition function
   */
  @Post("/:solutionId/transition")
  public async applyTransition(
    @Path("solutionId") solutionId: string,
    @Body() data: any,
    @Inject() solution: SolutionI
  ) {
    return applyTransition(data, solution);
  }
}
