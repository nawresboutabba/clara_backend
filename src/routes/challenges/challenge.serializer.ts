import {
  ChallengeResponse,
  LightChallengeResponse,
} from "../../controller/challenge";
import { AreaI } from "../../models/organization.area";
import { UserI } from "../../models/users";
import {
  getArrayImageSignedUrl,
  getSignedUrl,
} from "../../repository/repository.image-service";
import { genericArrayAreaFilter } from "../area/area.serializer";
import { genericGroupValidatorFilter } from "../../utils/field-filters/group-validator";
import {
  genericArrayUserFilter,
  genericUserFilter,
} from "../../utils/field-filters/user";
import { lightAlignmentSerializer } from "../strategic-alignment/strategic-alignment.serializer";
import { genericArrayTagsFilter } from "../tags/tags.serializer";
import { ChallengeI } from "./challenge.model";

/**
 * Challenge information filter.
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interface that finalize with "Response". For example UserResponse interface
 * @param challenge
 * @returns
 */

export async function genericChallengeFilter(challenge: ChallengeI) {
  const {
    _id,
    created,
    status,
    updated,
    title,
    description,
    price,
    goal,
    resources,
    wanted_impact,
    active,
    fileComplementary,
    finalization,
    type,
    targetAudienceValue,
    /**
     * Configuration section
     */
    canChooseScope,
    // defaultScope,
    canChooseWSALevel,
    WSALevelAvailable,
    WSALevelChosed,
    communityCanSeeReactions,
    participationModeAvailable,
    participationModeChosed,
    timeInPark,
    timeExpertFeedback,
    timeIdeaFix,
    externalContributionAvailableForGenerators,
    externalContributionAvailableForCommittee,
    interactions,
  } = challenge;
  const images = await getArrayImageSignedUrl(challenge.images);
  const banner_image = await getSignedUrl(challenge.bannerImage);
  const author = await genericUserFilter(challenge.author);
  const coauthor = await genericArrayUserFilter(challenge.coauthor);
  const inserted_by = await genericUserFilter(challenge.insertedBy);
  const areas_available = genericArrayAreaFilter(challenge.areasAvailable);
  const department_affected = genericArrayAreaFilter(
    challenge.departmentAffected
  );
  const group_validator = await genericGroupValidatorFilter(
    challenge.groupValidator
  );

  const tags = genericArrayTagsFilter(challenge.tags);

  return {
    id: _id,
    inserted_by,
    author,
    coauthor,
    created,
    status,
    updated,
    title,
    description,
    price,
    goal,
    resources,
    wanted_impact,
    active,
    file_complementary: fileComplementary,
    banner_image,
    images,
    tags,
    finalization,
    department_affected,
    group_validator,
    type,
    strategic_alignment: challenge.strategicAlignment
      ? lightAlignmentSerializer(challenge.strategicAlignment)
      : null,
    idea_behavior: challenge.ideaBehavior,
    target_audience: challenge.targetAudience,
    target_audience_value:
      challenge.targetAudience === "User"
        ? await genericArrayUserFilter(targetAudienceValue as UserI[])
        : challenge.targetAudience === "Area"
        ? genericArrayAreaFilter(targetAudienceValue as AreaI[])
        : [],
    /**
     * Configuration section
     */
    can_choose_scope: canChooseScope,
    // default_scope: defaultScope,
    can_choose_WSALevel: canChooseWSALevel,
    WSALevel_available: WSALevelAvailable,
    WSALevel_chosed: WSALevelChosed,
    areas_available,
    community_can_see_reactions: communityCanSeeReactions,
    participation_mode_available: participationModeAvailable,
    participation_mode_chosed: participationModeChosed,
    time_in_park: timeInPark,
    time_expert_feedback: timeExpertFeedback,
    time_idea_fix: timeIdeaFix,
    external_contribution_available_for_generators:
      externalContributionAvailableForGenerators,
    external_contribution_available_for_committee:
      externalContributionAvailableForCommittee,
    interactions,
  } as ChallengeResponse;
}

export async function lightChallengeFilter(challenge: ChallengeI) {
  const {
    _id,
    created,
    status,
    title,
    description,
    active,
    finalization,
    interactions,
    type,
  } = challenge;

  const images = await getArrayImageSignedUrl(challenge.images);
  const banner_image = await getSignedUrl(challenge.bannerImage);
  const areas_available = await genericArrayAreaFilter(
    challenge.areasAvailable
  );
  const group_validator = await genericGroupValidatorFilter(
    challenge.groupValidator
  );
  const author = await genericUserFilter(challenge.author);
  const coauthor = await genericArrayUserFilter(challenge.coauthor);

  const tags = genericArrayTagsFilter(challenge.tags);
  const department_affected = genericArrayAreaFilter(
    challenge.departmentAffected
  );

  return {
    id: _id,
    created,
    status,
    title,
    author,
    coauthor,
    description,
    active,
    banner_image,
    images,
    finalization,
    areas_available,
    department_affected,
    group_validator,
    interactions,
    type,
    tags,
    idea_behavior: challenge.ideaBehavior,
  } as LightChallengeResponse;
}

export function genericArrayChallengeFilter(challenges: Array<ChallengeI>) {
  return Promise.all(challenges.map(lightChallengeFilter));
}
