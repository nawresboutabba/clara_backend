import { z } from "zod";
import { CommentScope } from "../../../models/interaction.comment";
import { getComments } from "../../../repository/repository.comment";
import { validate } from "../../../utils/express/express-handler";
import { canViewSolution, getSolutionById } from "../solutions.repository";

export const getSolutionComment = validate({
  params: z.object({ solutionId: z.string(), commentId: z.string() }),
  query: z.object({
    scope: z.nativeEnum(CommentScope),
  })
}, async ({ user, params, query }, res) => {
  const solution = await getSolutionById(params.solutionId);
  if (!canViewSolution(user, solution)) {
    return res.status(403).json({ message: "not authorized" })
  }

  if (query.scope === CommentScope.GROUP) {
    const isInSolution = [
      ...solution.coauthor.map(coauthor => coauthor.userId),
      solution.author.userId,
      ...solution.externalOpinion.map(externalOpinion => externalOpinion.userId)
    ]
    if (!isInSolution.includes(user.userId)) {
      return res.status(403).json({ message: "not authorized" })
    }
  }

  // TODO: use mongodb aggregate
  return getComments({
    _id: params.commentId
  })[0];
})
