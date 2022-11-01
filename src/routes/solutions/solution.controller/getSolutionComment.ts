import { z } from "zod";
import { CommentScope } from "../../../models/interaction.comment";
import { validate } from "../../../utils/express/express-handler";
import {
  canViewSolution,
  getSolutionById,
  listSolutionComments,
} from "../solution.repository";

export const getSolutionComment = validate(
  {
    params: z.object({ solutionId: z.string(), commentId: z.string() }),
    query: z.object({
      scope: z.nativeEnum(CommentScope),
    }),
  },
  async ({ user, params, query }, res) => {
    const solution = await getSolutionById(params.solutionId);
    if (!canViewSolution(user, solution)) {
      return res.status(403).json({ message: "not authorized" });
    }

    if (
      query.scope === CommentScope.GROUP &&
      [
        solution.author.userId,
        solution.coauthor.map((coauthor) => coauthor.userId),
        solution.externalOpinion.map(
          (externalOpinion) => externalOpinion.userId
        ),
      ]
        .flat()
        .includes(user.userId) === false
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    return (
      await listSolutionComments({
        solutionId: solution.id,
        commentId: params.commentId,
      })
    )[0];
  }
);
