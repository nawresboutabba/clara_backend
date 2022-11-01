import { z } from "zod";
import Solution from "../../solutions/solution.model";
import { validate } from "../../../utils/express/express-handler";
import { genericArraySolutionsFilter } from "../../../utils/field-filters/solution";
import { sortSchema } from "../../../utils/params-query/sort.query";

export const getChallengeSolutions = validate(
  {
    params: z.object({ challengeId: z.string() }),
    query: z
      .object({
        init: z.number(),
        offset: z.number(),
        sort: z.object({ title: sortSchema, created: sortSchema }).partial(),
        participationMode: z.string(),
        type: z.string(),
      })
      .partial(),
  },
  async ({ query, params }) => {
    const solutions = await Solution.find({
      status: "APPROVED_FOR_DISCUSSION",
      challenge: params.challengeId,
    })
      .populate("insertedBy")
      .populate("author")
      .populate("areasAvailable")
      .populate("coauthor")
      .populate("team")
      .populate("groupValidator")
      .populate("challenge")
      .populate("tags")
      .populate("departmentAffected")
      .skip(query.init)
      .limit(query.offset)
      .sort(query.sort);

    return genericArraySolutionsFilter(solutions);
  }
);
