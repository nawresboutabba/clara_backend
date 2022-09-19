import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import {
  genericSolutionFilter
} from "../../../utils/field-filters/solution";
import * as SolutionRep from "../solutions.repository";

export const leaveSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
  },
  async ({ params: { solutionId }, user }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    if (solution.author.userId === user.userId) {
      return res.status(403).json({ message: "author cannot leave" });
    }

    if (solution.coauthor.every((e) => e.userId !== user.userId)) {
      return res.status(403).json({ message: "you are not in the team" });
    }

    const updatedSolution = await SolutionRep.updateSolutionPartially(
      solutionId,
      {
        $pull: { coauthor: user._id },
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);
