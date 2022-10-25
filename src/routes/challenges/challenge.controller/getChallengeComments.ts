import { z } from "zod";
import { CommentScope } from "../../../models/interaction.comment";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import * as challengeRep from '../challenges.repository';

export const getChallengeComments = validate(
  {
    params: z.object({ challengeId: z.string() }),
    query: z.object({
      scope: z.nativeEnum(CommentScope).optional().default(CommentScope.PUBLIC),
      tag: z.string().optional()
    })
  },
  async ({ user, params: { challengeId }, query }, res) => {
    const committee = await isCommitteeMember(user);

    const challenge = await challengeRep.getChallengeActiveById(challengeId)
    if (!challenge) {
      return res.status(400).json({ message: "Challenge does not exists" })
    }

    if (!challengeRep.canViewChallenge(user, challenge, committee)) {
      return res.status(403).json({ message: "not authorized" })
    }


    if (
      query.scope === CommentScope.GROUP &&
      !challengeRep.canViewChallenge(user, challenge, committee)
    ) {
      return res.status(403).json({ message: "Not authorized to see these comments" })
    }

    return challengeRep.listChallengeComments({ challengeId, scope: query.scope })
  }
)
