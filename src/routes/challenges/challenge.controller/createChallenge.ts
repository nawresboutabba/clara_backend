import Challenge, {
  CHALLENGE_STATUS_ENUM,
  CHALLENGE_TYPE,
} from "../challenge.model";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../challenge.serializer";

export const createChallenge = validate({}, async ({ user }, res) => {
  const committee = await isCommitteeMember(user);

  if (!committee.isActive) {
    return res.status(403).json({ message: "not authorized" });
  }

  const challenge = await Challenge.create({
    insertedBy: user,
    author: user,
    active: true,
    type: CHALLENGE_TYPE.PARTICULAR,
    status: CHALLENGE_STATUS_ENUM.enum.DRAFT,
    images: [],
    areasAvailable: [],
    departmentAffected: [],
  });

  const createdChallenge = await Challenge.findById(challenge._id)
    .populate("author")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("departmentAffected")
    .populate("strategicAlignment");

  return res.status(201).json(await genericChallengeFilter(createdChallenge));
});
