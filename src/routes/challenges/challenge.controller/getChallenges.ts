import { z } from "zod";
import Challenge, { CHALLENGE_STATUS } from "../../../models/situation.challenges";
import Solution from "../../../models/situation.solutions";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { genericArrayChallengeFilter } from "../../../utils/field-filters/challenge";
import { removeEmpty } from "../../../utils/general/remove-empty";
import { sortSchema } from "../../../utils/params-query/sort.query";

export const getChallenges = validate(
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
    /**
     * Listing for user internals and external is not the same.
     * The externals users just can see challenge what was invited.
     * The internals users can see all challenges.
     */
    if (user.externalUser) {
      const solutions = await Solution.find({
        active: true,
        coauthor: { $in: user },
      });

      const challenges = await Challenge.find(
        Object.assign(
          {
            solution: { $in: solutions },
            active: true,
          },
          query.title && {
            title: { $regex: `.*${query.title}.*`, $options: "i" },
          }
        )
      );

      return genericArrayChallengeFilter(challenges);
    }

    const committee = await isCommitteeMember(user);

    const status = committee.isActive ? query.status : CHALLENGE_STATUS.OPENED

    const challenges = await Challenge.find(
      Object.assign(
        {
          active: true,
          deleteAt: { $exists: false },
        },
        removeEmpty({
          type: query?.type,
          tags: query.tags.length > 0 ? { $in: query.tags } : null,
          departmentAffected: query.departmentAffected.length > 0 ? { $in: query?.departmentAffected } : null,
          status,
        }),
        query.title && {
          title: { $regex: `.*${query.title}.*`, $options: "i" },
        }
      )
      // participationModeAvailable: { $in: query.participationMode },
    )
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
