import {
  ChallengeResponse,
  LightChallengeResponse,
} from "../../controller/challenge";
import { ChallengeI } from "../../models/situation.challenges";
import { genericArrayAreaFilter } from "./area";
import { genericUserFilter } from "./user";
import { genericGroupValidatorFilter } from "./group-validator";
import {
  getArrayImageSignedUrl,
  getSignedUrl,
} from "../../repository/repository.image-service";
import { genericArrayTagsFilter } from "../../routes/tags/tags.serializer";

/**
 * Challenge information filter.
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interface that finalize with "Response". For example UserResponse interface
 * @param challenge
 * @returns
 */

export async function genericChallengeFilter(challenge: ChallengeI) {
  const {
    challengeId,
    created,
    status,
    updated,
    title,
    description,
    price,
    meta,
    resources,
    wanted_impact,
    active,
    fileComplementary,
    isStrategic,
    finalization,
    type,
    /**
     * Configuration section
     */
    canChooseScope,
    defaultScope,
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
    challenge_id: challengeId,
    inserted_by,
    author,
    created,
    status,
    updated,
    title,
    description,
    price,
    meta,
    resources,
    wanted_impact,
    active,
    file_complementary: fileComplementary,
    banner_image,
    images,
    tags,
    is_strategic: isStrategic,
    finalization,
    department_affected,
    group_validator,
    type,
    /**
     * Configuration section
     */
    can_choose_scope: canChooseScope,
    default_scope: defaultScope,
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
    challengeId,
    created,
    status,
    title,
    description,
    active,
    isStrategic,
    finalization,
    interactions,
    type,
  } = challenge;

  const images = await getArrayImageSignedUrl(challenge.images);
  const banner_image = await getSignedUrl(challenge.bannerImage);
  const areas_available = await genericArrayAreaFilter(
    challenge.areasAvailable
  );
  const department_affected = await genericArrayAreaFilter(
    challenge.departmentAffected
  );
  const group_validator = await genericGroupValidatorFilter(
    challenge.groupValidator
  );
  const tags = genericArrayTagsFilter(challenge.tags);

  return {
    challenge_id: challengeId,
    created,
    status,
    title,
    description,
    active,
    banner_image,
    images,
    is_strategic: isStrategic,
    finalization,
    areas_available,
    department_affected,
    group_validator,
    interactions,
    type,
    tags,
  } as LightChallengeResponse;
}

export function genericArrayChallengeFilter(challenges: Array<ChallengeI>) {
  return Promise.all(challenges.map(lightChallengeFilter));
}
