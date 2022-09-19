import { z } from "zod";
import Challenge from "../../../models/situation.challenges";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import { logVisit } from "../../../utils/general/log-visit";

export const getChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async (req) => {
    const challenge = await Challenge.findOne({
      challengeId: req.params.challengeId,
    })
      .populate("author")
      .populate("insertedBy")
      .populate("areasAvailable")
      .populate("departmentAffected");

    logVisit(req.user, challenge)
    return genericChallengeFilter(challenge);
  }
);
