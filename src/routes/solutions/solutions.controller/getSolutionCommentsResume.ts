import { z } from "zod";
import { CommentScope } from "../../../models/interaction.comment";
import CommentService from "../../../services/Comment.service";
import { validate } from "../../../utils/express/express-handler";
import { genericArrayCommentFilter } from "../../../utils/field-filters/comment";
import * as SolutionRep from "../solutions.repository";

export const getSolutionCommentsResume = validate({
  params: z.object({ solutionId: z.string() }),
}, async ({ user, params: { solutionId } }, res) => {
  const solution = await SolutionRep.getSolutionById(solutionId);
  if (!SolutionRep.canViewSolution(user, solution)) {
    return res.status(403).json({ message: "not authorized" })
  }

  const isInSolution = [
    ...solution.coauthor.map(coauthor => coauthor.userId),
    solution.author.userId,
    ...solution.externalOpinion.map(externalOpinion => externalOpinion.userId)
  ]
  if (!isInSolution.includes(user.userId)) {
    return res.status(403).json({ message: "not authorized" })
  }

  const comments = await CommentService.getComments({
    resource: solution,
    scope: CommentScope.GROUP,
  });

  return genericArrayCommentFilter(comments)
})
