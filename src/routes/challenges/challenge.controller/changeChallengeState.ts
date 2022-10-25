import { z } from "zod";
import { CHALLENGE_STATUS } from "../../../models/situation.challenges";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import ChallengeStateMachine from "../../../utils/state-machine/state-machine.challenge";
import { dateSchema, numberSchema } from "../../../utils/zod";
import * as ChallengeRep from "../challenges.repository";

const challengeSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  areas: z.array(z.string()),
  finalization: dateSchema(z.date().min(new Date)),
  banner_image: z.string(),
  images: z.array(z.string()),
  price: numberSchema(z.number()),
  goal: z.string(),
  resources: z.string(),
  wanted_impact: z.string(),
})

export const changeChallengeState = validate({
  params: z.object({ challengeId: z.string() }),
  body: z.object({ state: z.enum(["confirm", "published", "close", "reopen"]) })
}, async ({ user, params, body }, res) => {
  const challenge = await ChallengeRep.getChallengeById(params.challengeId);

  if (challenge.author.userId !== user.userId) {
    return res.status(403).json({ message: "not authorized" });
  }

  const parseResult = challengeSchema.safeParse(challenge);
  if (parseResult.success === false) {
    return res.status(400).send({
      message: "challenge is not completed",
      error: parseResult.error
    });
  }


  const updatedChallenge = await ChallengeRep.updateChallengePartially(params.challengeId, {
    status: ChallengeStateMachine.dispatch(challenge.status, body.state),
    // version,
  })


  return genericChallengeFilter(updatedChallenge);
})
