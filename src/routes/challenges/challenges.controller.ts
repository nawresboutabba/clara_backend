import { nanoid } from "nanoid";
import z from "zod";
import { CHALLENGE_STATUS, CHALLENGE_TYPE } from "../../constants";
import Challenge from "../../models/situation.challenges";
import Solution from "../../models/situation.solutions";
import * as TagsRep from "../tags/tags.repository";
import { isCommitteMember } from "../../utils/acl/function.is_committe_member";
import { validate } from "../../utils/express/express-handler";
import {
  genericArrayChallengeFilter,
  genericChallengeFilter,
} from "../../utils/field-filters/challenge";
import { genericArraySolutionsFilter } from "../../utils/field-filters/solution";
import { removeEmpty } from "../../utils/general/remove-empty";
import { sortSchema } from "../../utils/params-query/sort.query";

const getChallenges = validate(
  {
    query: z
      .object({
        title: z.string(),
        tags: z.array(z.string()),
        departmentAffected: z.array(z.string()),
        init: z.number(),
        offset: z.number(),
        sort: z.object({ title: sortSchema, created: sortSchema }).partial(),
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

      return genericArrayChallengeFilter(challenges);
    } else {
      const challenges = await Challenge.find(
        Object.assign(
          { active: true, status: CHALLENGE_STATUS.OPENED },
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

      return genericArrayChallengeFilter(challenges);
    }
  }
);

const getChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async (req, res) => {
    const challenge = await Challenge.findOne({
      challengeId: req.params.challengeId,
    })
      .populate("author")
      .populate("insertedBy")
      .populate("areasAvailable")
      .populate("departmentAffected");
    return genericChallengeFilter(challenge);
  }
);

const getChallengeSolutions = validate(
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

    return genericArraySolutionsFilter(solutions);
  }
);

const createChallenge = validate({}, async ({ user }, res) => {
  const committee = await isCommitteMember(user);

  const challenge = await Challenge.create({
    insertedBy: user,
    author: user,
    challengeId: nanoid(),
    active: true,
    type: CHALLENGE_TYPE.PARTICULAR,
    status: CHALLENGE_STATUS.DRAFT,
    images: [],
    areasAvailable: [],
    departmentAffected: [],
  });

  const createdChallenge = await Challenge.findOne({
    challengeId: challenge.challengeId,
  })
    .populate("author")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("departmentAffected");

  res.status(201).json(await genericChallengeFilter(createdChallenge));
});

const updateChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z
      .object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        areas: z.array(z.string()),
        finalization: z.date(),
        banner_image: z.string(),
        images: z.array(z.string()),
        price: z.number(),
        meta: z.string(),
        resources: z.string(),
        wanted_impact: z.string(),
      })
      .partial(),
  },
  async ({ user, params, body }, res) => {
    const challenge = await Challenge.findOne({
      challengeId: params.challengeId,
    }).populate("author");

    if (challenge.author.userId !== user.userId) {
      return res.status(401).send();
    }

    const tags = await TagsRep.getTagsById(body.tags);

    const updatedChallenge = await Challenge.findOneAndUpdate(
      {
        challengeId: params.challengeId,
      },
      removeEmpty({
        title: body.title,
        description: body.description,
        bannerImage: body.banner_image,
        images: body.images,
        tags,
        finalization: body.finalization,
        price: body.price,
        meta: body.meta,
        resources: body.resources,
        wanted_impact: body.wanted_impact,
      }),
      { new: true }
    )
      .populate("author")
      .populate("insertedBy")
      .populate("areasAvailable")
      .populate("departmentAffected");

    return genericChallengeFilter(updatedChallenge);
  }
);

const deleteChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
  },
  async ({ user, params }, res) => {
    const challenge = await Challenge.findOne({
      challengeId: params.challengeId,
    }).populate("author");

    if (challenge.author.userId !== user.userId) {
      return res.status(401).send();
    }

    await challenge.delete();

    return genericChallengeFilter(challenge);
  }
);

export const challengesController = {
  getChallenges,
  getChallenge,
  getChallengeSolutions,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};
