import { z } from "zod";
import Challenge, { CHALLENGE_STATUS } from "../../../models/situation.challenges";
import { validate } from "../../../utils/express/express-handler";
import { genericArrayChallengeFilter } from "../../../utils/field-filters/challenge";
import { removeEmpty } from "../../../utils/general/remove-empty";
import { sortSchema } from "../../../utils/params-query/sort.query";

export const participatedChallenges = validate(
  {
    query: z
      .object({
        title: z.string().optional(),
        tags: z.array(z.string()).default([]),
        status: z.nativeEnum(CHALLENGE_STATUS).optional(),
        departmentAffected: z.array(z.string()).default([]),
        init: z.number().default(0),
        offset: z.number().default(10),
        sort: z
          .object({ title: sortSchema, created: sortSchema })
          .partial()
          .default({ created: -1 }),
        participationMode: z.string().optional(),
        type: z.string().optional(),
      }),
  },
  async ({ user, query }) => {

    const hasUserQuery = {
      $or: [{ author: user }, { coauthor: user }, { externalOpinion: user }],
    };
    const filterQuery = Object.assign(
      {
        active: true,
        deleteAt: { $exists: false },
      },
      removeEmpty({
        type: query?.type,
        tags: query.tags.length > 0 ? { $in: query.tags } : null,
        departmentAffected: query.departmentAffected.length > 0 ? { $in: query?.departmentAffected } : null,
        status: query.status,
      }),
      query.title && {
        title: { $regex: `.*${query.title}.*`, $options: "i" },
      }
    )

    const challenges = await Challenge.find({
      $and: [hasUserQuery, filterQuery]
    })
      .populate("tags")
      .populate("departmentAffected")
      .populate("author")
      .populate("coauthor")
      .skip(query.init)
      .limit(query.offset)
      .sort(query.sort);

    return genericArrayChallengeFilter(challenges);
  }
);
