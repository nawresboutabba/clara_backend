import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../challenge.serializer";
import ChallengeStateMachine from "../../../utils/state-machine/state-machine.challenge";
import { dateSchema } from "../../../utils/zod";
import * as ChallengeRep from "../challenge.repository";

const challengeSchema = z.object({
  title: z.string(),
  description: z.string(),
  bannerImage: z.string(),
  // images: z.array(z.any()),
  tags: z.array(z.any()).min(1),
  departmentAffected: z.array(z.any()).min(1),
  finalization: dateSchema(z.date().min(new Date())),
  price: z.number().positive(),
  goal: z.string(),
  resources: z.string(),
  wanted_impact: z.string(),
});

export const changeChallengeState = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z.object({
      state: z.enum(["confirm", "published", "close", "reopen", "draft"]),
    }),
  },
  async ({ user, params, body }, res) => {
    const challenge = await ChallengeRep.getChallengeById(params.challengeId);

    if (challenge.author.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" });
    }

    const parseResult = challengeSchema.safeParse(challenge);
    if (parseResult.success === false) {
      return res.status(400).send({
        message: "challenge is not completed",
        error: parseResult.error,
      });
    }

    const updatedChallenge = await ChallengeRep.updateChallengePartially(
      params.challengeId,
      {
        status: ChallengeStateMachine.dispatch(challenge.status, body.state),
        // version,
      }
    );

    return genericChallengeFilter(updatedChallenge);
  }
);
