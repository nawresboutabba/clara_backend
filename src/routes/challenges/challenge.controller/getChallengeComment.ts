import { z } from "zod";
import { ChallengeComment, CommentScope } from "../../../models/interaction.comment";
import { Tag } from "../../../models/tag";
import { getComments } from "../../../repository/repository.comment";
import CommentService from "../../../services/Comment.service";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import { genericCommentFilter } from "../../../utils/field-filters/comment";
import * as challengeRep from '../challenges.repository'

export const getChallengeComment = validate(
  {
    params: z.object({ challengeId: z.string(), commentId: z.string() }),
    query: z.object({
      comment: z.string(),
      scope: z.nativeEnum(CommentScope),
      parent: z.string().optional(),
      tag: z.string()
    })
  },
  async ({ user, params: { challengeId, commentId }, query }, res) => {
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
      committee.isActive === false &&
      !challenge.externalOpinion.map(externalOpinion => externalOpinion.userId).includes(user.userId)
    ) {
      return res.status(403).json({ message: "Not authorized to create comment on this challenge" })
    }


    // TODO: use mongodb aggregate
    return getComments({
      _id: commentId
    })[0];
  }
)
