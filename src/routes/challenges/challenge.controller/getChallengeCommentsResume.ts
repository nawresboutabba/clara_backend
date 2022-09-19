import { z } from "zod";
import { ChallengeComment, CommentScope } from "../../../models/interaction.comment";
import { Tag } from "../../../models/tag";
import CommentService from "../../../services/Comment.service";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import { genericArrayCommentFilter, genericCommentFilter } from "../../../utils/field-filters/comment";
import * as challengeRep from '../challenges.repository'

export const getChallengeCommentsResume = validate(
  {
    params: z.object({ challengeId: z.string(), commentId: z.string() }),
    query: z.object({
      comment: z.string(),
      scope: z.nativeEnum(CommentScope).default(CommentScope.GROUP),
      parent: z.string().optional(),
      tag: z.string()
    })
  },
  async ({ user, params: { challengeId } }, res) => {
    const committee = await isCommitteeMember(user);

    const challenge = await challengeRep.getChallengeActiveById(challengeId)
    if (!challenge) {
      return res.status(400).json({ message: "Challenge does not exists" })
    }

    if (!challengeRep.canViewChallenge(user, challenge, committee)) {
      return res.status(403).json({ message: "not authorized" })
    }

    const comments = await CommentService.getComments({
      resource: challenge,
      scope: CommentScope.GROUP,
    });

    return genericArrayCommentFilter(comments)
  }
)
