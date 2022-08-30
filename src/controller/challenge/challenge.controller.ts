import z from "zod";
import Challenge from "../../models/situation.challenges";
import Solution from "../../models/situation.solutions";
import { validate } from "../../utils/express/express-handler";
import {
  genericArrayChallengeFilter,
  genericChallengeFilter,
} from "../../utils/field-filters/challenge";
import { genericArraySolutionsFilter } from "../../utils/field-filters/solution";
import { removeEmpty } from "../../utils/general/remove-empty";

const sortZod = z.union([
  z.literal(-1),
  z.literal(1),
  z.literal("asc"),
  z.literal("ascending"),
  z.literal("desc"),
  z.literal("descending"),
]);

export const getChallengesController = validate(
  {
    query: z
      .object({
        title: z.string(),
        tags: z.array(z.string()),
        departmentAffected: z.array(z.string()),
        init: z.number(),
        offset: z.number(),
        sort: z
          .object({
            title: sortZod,
            created: sortZod,
          })
          .partial(),
        participationMode: z.string(),
        type: z.string(),
      })
      .partial(),
  },
  async ({ user, query }, res) => {
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

      res.json(genericArrayChallengeFilter(challenges));
    } else {
      const challenges = await Challenge.find(
        Object.assign(
          { active: true },
          removeEmpty({
            tags: query?.tags,
            type: query?.type,
            departmentAffected: query?.departmentAffected,
          }),
          query.title && {
            title: { $regex: `.*${query.title}.*`, $options: "i" },
          }
        )
        // participationModeAvailable: { $in: query.participationMode },
      )
        .populate("tags")
        .populate("departmentAffected")
        .skip(query.init)
        .limit(query.offset)
        .sort(query.sort);

      const result = await genericArrayChallengeFilter(challenges);
      res.json(result);
    }
  }
);

export const getChallengeController = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async (req, res) => {
    const challenge = await Challenge.findOne({
      challengeId: req.params.challengeId,
    });
    const serializedChallenge = await genericChallengeFilter(challenge);
    res.json(serializedChallenge);
  }
);

export const getChallengeSolutionsController = validate(
  {
    params: z.object({ challengeId: z.string() }),
    query: z
      .object({
        init: z.number(),
        offset: z.number(),
        sort: z
          .object({
            title: sortZod,
            created: sortZod,
          })
          .partial(),
        participationMode: z.string(),
        type: z.string(),
      })
      .partial(),
  },
  async ({ query, params }, res) => {
    const solutions = await Solution.find({
      status: "APPROVED_FOR_DISCUSSION",
      challengeId: params.challengeId,
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

    res.json(await genericArraySolutionsFilter(solutions));
  }
);
