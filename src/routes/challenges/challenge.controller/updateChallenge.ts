import { z } from "zod";
import Challenge from "../../../models/situation.challenges";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import { removeEmpty } from "../../../utils/general/remove-empty";
import * as TagsRep from "../../tags/tags.repository";

export const updateChallenge = validate(
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
