import { z } from "zod";
import Challenge from "../challenge.model";
import User, { UserI } from "../../../models/users";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import * as ChallengeRep from "../challenge.repository";

export const changeChallengeAuthor = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z.object({ userId: z.string() }),
  },
  async ({ params: { challengeId }, user, body }, res) => {
    const challenge = await ChallengeRep.getChallengeById(challengeId);

    const newAuthor = await User.findOne({ userId: body.userId });

    if (
      challenge.author.userId !== user.userId &&
      !challenge.coauthor.some((e: UserI) => e.userId === newAuthor.userId)
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    await Challenge.findByIdAndUpdate(challengeId, {
      $pull: { coauthor: newAuthor._id },
    });

    const updatedChallenge = await ChallengeRep.updateChallengePartially(
      challengeId,
      {
        $set: { author: newAuthor },
        $addToSet: { coauthor: user },
      }
    );

    return genericChallengeFilter(updatedChallenge);
  }
);
