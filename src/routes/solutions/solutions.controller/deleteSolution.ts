import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import {
  genericSolutionFilter
} from "../../../utils/field-filters/solution";
import * as SolutionRep from "../solutions.repository";

export const deleteSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
  },
  async ({ user, params: { solutionId } }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    if (solution.status !== "DRAFT" || solution.author.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" })
    }

    if (solution.deletedAt) {
      return res.status(400).json({ message: "Cannot delete this challenge" });
    }

    solution.deletedAt = new Date()

    return res.status(201).json(await genericSolutionFilter(solution));
  }
);
