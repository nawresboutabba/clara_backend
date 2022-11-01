import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import * as ChallengeRep from "../challenge.repository";

export const deleteChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async ({ user, params }, res) => {
    const challenge = await ChallengeRep.getChallengeById(params.challengeId);

    if (
      challenge.status !== "DRAFT" ||
      challenge.author.userId !== user.userId
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    if (challenge.deletedAt) {
      return res.status(400).json({ message: "Cannot delete this challenge" });
    }

    challenge.deletedAt = new Date();

    await challenge.save();

    return res.status(201).json(await genericChallengeFilter(challenge));
  }
);
