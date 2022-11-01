import { HydratedDocument } from "mongoose";
import { z } from "zod";
import {
  ChallengeComment,
  ChallengeCommentI,
  CommentScope,
} from "../../../models/interaction.comment";
import { Tag } from "../../../models/tag";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import { genericCommentFilter } from "../../../utils/field-filters/comment";
import * as challengeRep from "../challenge.repository";

export const createChallengeComment = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z.object({
      comment: z.string(),
      scope: z.nativeEnum(CommentScope),
      parent: z.string().optional(),
      tag: z.string(),
    }),
  },
  async ({ user, params: { challengeId }, body }, res) => {
    const committee = await isCommitteeMember(user);

    const challenge = await challengeRep.getChallengeActiveById(challengeId);
    if (!challenge) {
      return res.status(400).json({ message: "Challenge does not exists" });
    }

    const parentComment = await ChallengeComment.findById(body.parent)
      .populate("author")
      .populate("insertedBy")
      .populate("parent")
      .populate("tag")
      .populate("resource");

    if (parentComment.resource.id !== challenge.id) {
      return res
        .status(400)
        .json({ message: `parent not belongs to challenge ${challenge.id}` });
    }

    if (parentComment !== null && parentComment.parent !== null) {
      return res.status(400).json({ message: "Max comment child level is 2" });
    }

    const tag = await Tag.findById(body.tag);
    if (!tag) {
      return res.status(400).json({ message: "Tag does not exists" });
    }

    if (
      body.scope === CommentScope.GROUP &&
      !challengeRep.canViewChallenge(user, challenge, committee)
    ) {
      return res
        .status(403)
        .json({
          message: "Not authorized to create comment on this challenge",
        });
    }

    const newComment: HydratedDocument<ChallengeCommentI> =
      new ChallengeComment({
        author: user,
        insertedBy: user,
        resource: challenge,
        scope: body.scope,
        comment: body.comment,
        parent: parentComment,
        tag: parentComment ? parentComment.tag : tag,
      });

    await newComment.save();

    return res.status(201).json(await genericCommentFilter(newComment));
  }
);
