import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import { logVisit } from "../../../utils/general/log-visit";
import * as ChallengeRep from "../challenges.repository";
import { canViewChallenge } from "../challenges.repository";

export const getChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async ({ user, params }, res) => {
    const challenge = await ChallengeRep.getChallengeById(params.challengeId);

    const committee = await isCommitteeMember(user);

    if (!canViewChallenge(user, challenge, committee)) {
      return res.status(403).json({ message: "not authorized" })
    }

    logVisit(user, challenge)
    return genericChallengeFilter(challenge);
  }
);
