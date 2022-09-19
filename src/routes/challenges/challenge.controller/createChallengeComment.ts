import { z } from "zod";
import { ChallengeComment, CommentScope } from "../../../models/interaction.comment";
import { Tag } from "../../../models/tag";
import CommentService from "../../../services/Comment.service";
import { isCommitteMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import { genericCommentFilter } from "../../../utils/field-filters/comment";
import * as challengeRep from '../challenges.repository'

export const createChallengeComment = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z.object({
      comment: z.string(),
      scope: z.nativeEnum(CommentScope),
      parent: z.string().optional(),
      tag: z.string()
    })
  },
  async ({ user, params: { challengeId }, body }, res) => {
    const committee = await isCommitteMember(user);

    const challenge = await challengeRep.getChallengeActiveById(challengeId)
    if (!challenge) {
      return res.status(400).json({ message: "Challenge does not exists" })
    }

    const parentComment = await CommentService.getComment(body.parent);

    if (parentComment !== null && parentComment.parent !== null) {
      return res.status(400).json({ message: "Max level of 3" })
    }

    const tag = await Tag.findById(body.tag)
    if (!tag) {
      return res.status(400).json({ message: "Tag does not exists" })
    }

    if (body.scope === CommentScope.GROUP && committee.isActive === false) {
      if (!challenge.externalOpinion.map(externalOpinion => externalOpinion.userId).includes(user.userId)) {
        return res.status(403).json({ message: "Not authorized to create comment on this challenge" })
      }
    }

    const newComment = await ChallengeComment.create({
      author: user,
      insertedBy: user,
      resource: challenge,
      scope: body.scope,
      comment: body.comment,
      parent: parentComment,
      tag: parentComment ? parentComment.tag : tag,
    })

    return genericCommentFilter(newComment)
  }
)
