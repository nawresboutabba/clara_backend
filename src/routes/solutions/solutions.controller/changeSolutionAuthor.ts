import { z } from "zod";
import Solution from "../solution.model";
import User, { UserI } from "../../../models/users";
import { validate } from "../../../utils/express/express-handler";
import { genericSolutionFilter } from "../../../utils/field-filters/solution";
import * as SolutionRep from "../solutions.repository";

export const changeSolutionAuthor = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({ userId: z.string() }),
  },
  async ({ params: { solutionId }, user, body }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    const newAuthor = await User.findOne({ userId: body.userId });

    if (
      solution.author.userId !== user.userId &&
      !solution.coauthor.some((e: UserI) => e.userId === newAuthor.userId)
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    await Solution.updateOne(
      { solutionId },
      {
        $pull: { coauthor: newAuthor._id },
      }
    );

    const updatedSolution = await SolutionRep.updateSolutionPartially(
      solutionId,
      {
        $set: { author: newAuthor },
        $addToSet: { coauthor: user },
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);
