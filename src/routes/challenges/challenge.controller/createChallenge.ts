import { nanoid } from "nanoid";
import Challenge, { CHALLENGE_STATUS, CHALLENGE_TYPE } from "../../../models/situation.challenges";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";

export const createChallenge = validate({}, async ({ user }, res) => {
  const committee = await isCommitteeMember(user);

  if (!committee.isActive) {
    return res.status(403).json({ message: "not authorized" })
  }

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

  const createdChallenge = await Challenge.findById(challenge._id)
    .populate("author")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("departmentAffected");

  return res.status(201).json(await genericChallengeFilter(createdChallenge));
});
