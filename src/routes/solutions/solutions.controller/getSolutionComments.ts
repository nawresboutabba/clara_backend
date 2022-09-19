import { z } from "zod";
import { CommentScope } from "../../../models/interaction.comment";
import { getComments } from "../../../repository/repository.comment";
import { validate } from "../../../utils/express/express-handler";
import * as SolutionRep from "../solutions.repository";

export const getSolutionComments = validate({
  params: z.object({ solutionId: z.string() }),
  query: z.object({
    scope: z.nativeEnum(CommentScope),
  })
}, async ({ user, params: { solutionId }, query }, res) => {
  const solution = await SolutionRep.getSolutionById(solutionId);
  if (!SolutionRep.canViewSolution(user, solution)) {
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

  return SolutionRep.listSolutionComments({ solutionId, scope: query.scope })
})
