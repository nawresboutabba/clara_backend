import { GroupValidatorResponse } from "../../repository/repository.group-validator";
import { AreaSerialized } from "../../routes/area";
import { TagSerialized } from "../../routes/tags/tags.serializer";
import { TeamResponse } from "../team";
import { UserResponse } from "../users";

export interface SituationBody {
  author?: string;
  title: string;
  description: string;
  banner_image: string;
  images: Array<string>;
  department_affected: Array<string>;
  /**
   * Group Validat Id
   */
  group_validator?: string;
  file_complementary: Array<string>;
  /**
   * Configuration Section
   */
  can_show_disagreement: boolean;
  can_fix_disapproved_idea: boolean;
  can_choose_scope: boolean;
  /**
   * if committee allow to user choose solution privacy
   */
  is_privated: boolean;
  can_choose_WSALevel: boolean;
  WSALevel_available: Array<string>;
  WSALevel_chosed: string;
  areas_available: Array<string>;
  community_can_see_reactions: boolean;
  minimum_likes: number;
  maximum_dont_understand: number;
  reaction_filter: boolean;
  participation_mode_available: Array<string>;
  participation_mode_chosed: string;
  time_in_park: number;
  time_expert_feedback: number;
  time_idea_fix: number;
  external_contribution_available_for_generators: boolean;
  external_contribution_available_for_committee: boolean;
}

export interface LightSituationResponse {
  /**
   * User that inserted the solution
   */
  inserted_by: UserResponse;
  author?: UserResponse;
  coauthor?: UserResponse[];
  team?: TeamResponse;
  external_opinion?: UserResponse[];
  created: Date;
  title: string;
  description: string;
  banner_image: string;
  images: Array<string>;
  status: string;
}

export interface SituationResponse extends LightSituationResponse {
  active: boolean;
  updated: Date;
  department_affected: Array<AreaSerialized>;
  group_validator?: GroupValidatorResponse;
  file_complementary: Array<string>;
  tags: TagSerialized[];
  /**
   * Configuration Section
   */
  can_choose_scope: boolean;
  can_choose_WSALevel: boolean;
  WSALevel_available: Array<string>;
  WSALevel_chosed: string;
  areas_available: Array<AreaSerialized>;
  community_can_see_reactions: boolean;
  participation_mode_available: Array<string>;
  participation_mode_chosed: string;
  time_in_park: number;
  time_expert_feedback: number;
  time_idea_fix: number;
  external_contribution_available_for_generators: boolean;
  external_contribution_available_for_committee: boolean;
}
