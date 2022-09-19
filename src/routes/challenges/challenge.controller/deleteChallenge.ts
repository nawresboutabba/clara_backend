import { z } from "zod";
import Challenge from "../../../models/situation.challenges";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";

export const deleteChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async ({ user, params }, res) => {
    const challenge = await Challenge.findOne({
      challengeId: params.challengeId,
    }).populate("author");

    if (challenge.author.userId !== user.userId) {
      return res.status(401).send();
    }

    if (challenge.deletedAt) {
      return res.status(400).json({ message: "Cannot delete this challenge" });
    }

    challenge.deletedAt = new Date();

    await challenge.save();

    return genericChallengeFilter(challenge);
  }
);
