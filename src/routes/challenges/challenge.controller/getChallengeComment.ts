import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import * as challengeRep from '../challenges.repository';

export const getChallengeComment = validate({
  params: z.object({ challengeId: z.string(), commentId: z.string() }),
}, async ({ user, params: { challengeId, commentId } }, res) => {
  const committee = await isCommitteeMember(user);

  const challenge = await challengeRep.getChallengeActiveById(challengeId)
  if (!challenge) {
    return res.status(400).json({ message: "Challenge does not exists" })
  }

  if (!challengeRep.canViewChallenge(user, challenge, committee)) {
    return res.status(403).json({ message: "not authorized" })
  }

  return (await challengeRep.listChallengeComments({ challengeId, commentId }))[0]
})
