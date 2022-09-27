import { z } from "zod";
import Challenge from "../../../models/situation.challenges";
import AreaService from "../../../services/Area.service";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../../../utils/field-filters/challenge";
import { removeEmpty } from "../../../utils/general/remove-empty";
import * as TagsRep from "../../tags/tags.repository";

export const updateChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        areas: z.array(z.string()).optional(),
        finalization: z.date().min(new Date).optional(),
        banner_image: z.string().optional(),
        images: z.array(z.string()).optional(),
        price: z.number().optional(),
        meta: z.string().optional(),
        resources: z.string().optional(),
        wanted_impact: z.string().optional(),
      }),
  },
  async ({ user, params, body }, res) => {
    const challenge = await Challenge.findById(params.challengeId)
      .populate("author")
      .populate("insertedBy")
      .populate("areasAvailable")
      .populate("departmentAffected");

    if (challenge.author.userId !== user.userId) {
      return res.status(401).send();
    }

    const tags = await TagsRep.getTagsById(body.tags);
    const departmentAffected = await AreaService.getAreasById(body.areas)

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      params.challengeId,
      removeEmpty({
        title: body.title,
        description: body.description,
        bannerImage: body.banner_image,
        images: body.images,
        tags,
        departmentAffected,
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

    return res.status(201).json(await genericChallengeFilter(updatedChallenge));
  }
);
