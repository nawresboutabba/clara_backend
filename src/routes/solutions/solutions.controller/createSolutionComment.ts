import { z } from "zod";
import { ChallengeComment, CommentScope } from "../../../models/interaction.comment";
import { Tag } from "../../../models/tag";
import CommentService from "../../../services/Comment.service";
import { validate } from "../../../utils/express/express-handler";
import { genericCommentFilter } from "../../../utils/field-filters/comment";
import * as SolutionRep from "../solutions.repository";

export const createSolutionComment = validate({
  params: z.object({ solutionId: z.string() }),
  body: z.object({
    comment: z.string(),
    scope: z.nativeEnum(CommentScope),
    parent: z.string().optional(),
    tag: z.string()
  })
}, async ({ user, params: { solutionId }, body }, res) => {
  const solution = await SolutionRep.getSolutionById(solutionId);
  if (!SolutionRep.canViewSolution(user, solution)) {
    return res.status(403).json({ message: "not authorized" })
  }

  if (body.scope === CommentScope.GROUP) {
    const isInSolution = [
      ...solution.coauthor.map(coauthor => coauthor.userId),
      solution.author.userId,
      ...solution.externalOpinion.map(externalOpinion => externalOpinion.userId)
    ]
    if (!isInSolution.includes(user.userId)) {
      return res.status(403).json({ message: "not authorized" })
    }
  }

  const parentComment = await CommentService.getComment(body.parent);
  if (parentComment !== null && parentComment.parent !== null) {
    return res.status(400).json({ message: "Max comment child level is 2" })
  }

  const tag = await Tag.findById(body.tag)
  if (!tag) {
    return res.status(400).json({ message: "Tag does not exists" })
  }

  const newComment = await ChallengeComment.create({
    author: user,
    insertedBy: user,
    resource: solution,
    scope: body.scope,
    comment: body.comment,
    parent: parentComment,
    tag: parentComment ? parentComment.tag : tag,
  })

  return res.status(201).json(await genericCommentFilter(newComment));
})
