import { z } from "zod";
import { SOLUTION_STATUS_ENUM } from "../solution.model";
import { validate } from "../../../utils/express/express-handler";
import { genericArraySolutionsFilter } from "../solution.serializer";
import { removeEmpty } from "../../../utils/general/remove-empty";
import { sortSchema } from "../../../utils/params-query/sort.query";
import * as SolutionRep from "../solution.repository";

export const getSolutions = validate(
  {
    query: z.object({
      title: z.string().optional(),
      tags: z.array(z.string()).default([]),
      departmentAffected: z.array(z.string()).default([]),
      status: SOLUTION_STATUS_ENUM.optional(),
      challengeId: z.string().optional(),
      type: z.enum(["PARTICULAR", "GENERIC"]).optional(),
      as: z.enum(["AUTHOR", "COAUTHOR"]).optional(),
      init: z.number().default(0),
      offset: z.number().default(10),
      sort: z
        .object({ title: sortSchema, created: sortSchema })
        .partial()
        .default({ created: -1 }),
    }),
  },
  async ({ user, query }) => {
    const filterQuery = Object.assign(
      { active: true },
      removeEmpty({
        status: query?.status,
        type: query?.type,
        tags: query.tags.length > 0 ? { $in: query.tags } : null,
        departmentAffected:
          query.departmentAffected.length > 0
            ? { $in: query?.departmentAffected }
            : null,
      }),
      query.title && {
        title: { $regex: `.*${query.title}.*`, $options: "i" },
      },
      query.as === "AUTHOR" && {
        author: user,
      },
      query.as === "COAUTHOR" && {
        coauthor: user,
      }
    );

    // const hasUserQuery = {
    // $or: [{ author: user }, { coauthor: user }, { externalOpinion: user }],
    // };

    const solutions = await SolutionRep.getSolutions(
      filterQuery
    )
      .skip(query.init)
      .limit(query.offset)
      .sort(query.sort);
    return genericArraySolutionsFilter(solutions);
  }
);
