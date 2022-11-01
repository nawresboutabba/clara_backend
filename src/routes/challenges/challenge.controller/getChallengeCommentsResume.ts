import { z } from "zod";
import {
  ChallengeComment,
  CommentScope,
} from "../../../models/interaction.comment";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";

import { validate } from "../../../utils/express/express-handler";
import { genericArrayCommentFilter } from "../../../utils/field-filters/comment";
import { removeEmpty } from "../../../utils/general/remove-empty";
import * as challengeRep from "../challenge.repository";

export const getChallengeCommentsResume = validate(
  {
    params: z.object({ challengeId: z.string() }),
    query: z.object({
      comment: z.string().optional(),
      scope: z.nativeEnum(CommentScope).optional(),
      parent: z.string().optional(),
      tag: z.string().optional(),
    }),
  },
  async ({ user, params: { challengeId }, query }, res) => {
    const committee = await isCommitteeMember(user);

    const challenge = await challengeRep.getChallengeActiveById(challengeId);
    if (!challenge) {
      return res.status(400).json({ message: "Challenge does not exists" });
    }

    if (!challengeRep.canViewChallenge(user, challenge, committee)) {
      return res.status(403).json({ message: "not authorized" });
    }

    const comments = await ChallengeComment.find(
      removeEmpty({
        resource: challenge,
        scope: query.scope,
        parent: query.parent,
      })
    )
      .populate("author")
      .populate("tag")
      .populate("parent");

    return genericArrayCommentFilter(comments);
  }
);
