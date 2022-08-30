import { z } from "zod";
import Solution from "../../models/situation.solutions";
import User, { UserI } from "../../models/users";
import SolutionService from "../../services/Solution.service";
import { validate } from "../../utils/express/express-handler";
import { genericSolutionFilter } from "../../utils/field-filters/solution";

const changeAuthor = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({ userId: z.string() }),
  },
  async ({ params: { solutionId }, user, body }, res) => {
    const solution = await Solution.findOne({ solutionId })
      .populate("departmentAffected")
      .populate("updatedBy")
      .populate("challenge")
      .populate("author")
      .populate("coauthor")
      .populate("team")
      .populate("insertedBy")
      .populate("areasAvailable")
      .populate("tags")
      .populate("externalOpinion");

    const newAuthor = await User.findOne({ userId: body.userId });

    if (
      solution.author.userId !== user.userId ||
      !solution.coauthor.some((e: UserI) => e.userId === newAuthor.userId)
    ) {
      return res.status(401).json({ message: "not authorized" });
    }

    await Solution.updateOne(
      { solutionId },
      {
        $pull: { coauthor: newAuthor._id },
      }
    );

    const updatedSolution = await SolutionService.updateSolutionPartially(
      solutionId,
      {
        $set: { author: newAuthor },
        $addToSet: { coauthor: user },
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);

const leaveSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
  },
  async ({ params: { solutionId }, user }, res) => {
    const solution = await Solution.findOne({ solutionId }).populate("author");

    if (solution.author.userId === user.userId) {
      return res.status(401).json({ message: "author cannot leave" });
    }

    const updatedSolution = await SolutionService.updateSolutionPartially(
      solutionId,
      {
        $pull: { coauthor: user._id },
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);

export const solutionsController = {
  changeAuthor,
  leaveSolution,
};
