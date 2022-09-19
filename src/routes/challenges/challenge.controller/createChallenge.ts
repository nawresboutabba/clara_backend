import { nanoid } from "nanoid";
import Challenge, { CHALLENGE_STATUS, CHALLENGE_TYPE } from "../../../models/situation.challenges";
import { isCommitteMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";

export const createChallenge = validate({}, async ({ user }, res) => {
  const committee = await isCommitteMember(user);

  const challenge = await Challenge.create({
    insertedBy: user,
    author: user,
    challengeId: nanoid(),
    active: true,
    type: CHALLENGE_TYPE.PARTICULAR,
    status: CHALLENGE_STATUS.DRAFT,
    images: [],
    areasAvailable: [],
    departmentAffected: [],
  });

  const createdChallenge = await Challenge.findOne({
    challengeId: challenge.challengeId,
  })
    .populate("author")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("departmentAffected");

  res.status(201).json(await genericChallengeFilter(createdChallenge));
});
