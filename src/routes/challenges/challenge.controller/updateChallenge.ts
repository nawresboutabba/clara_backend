import { z } from "zod";
import Challenge from "../challenge.model";
import AreaService from "../../../services/Area.service";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeFilter } from "../challenge.serializer";
import { removeEmpty } from "../../../utils/general/remove-empty";
import { dateSchema, numberSchema } from "../../../utils/zod";
import * as TagsRep from "../../tags/tags.repository";
import { StrategicAlignment } from "../../strategic-alignment/strategic-alignment.model";

export const updateChallenge = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z.object({
      title: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      areas: z.array(z.string()).optional(),
      finalization: dateSchema(z.date().min(new Date()).optional()),
      banner_image: z.string().optional(),
      images: z.array(z.string()).optional(),
      price: numberSchema(z.number().optional()),
      goal: z.string().optional(),
      resources: z.string().optional(),
      wanted_impact: z.string().optional(),
      strategic_alignment: z.string().optional(),
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
    const departmentAffected = await AreaService.getAreasById(body.areas);
    const strategicAlignment = await StrategicAlignment.findById(
      body.strategic_alignment
    );

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
        goal: body.goal,
        resources: body.resources,
        wanted_impact: body.wanted_impact,
        strategicAlignment,
      }),
      { new: true }
    )
      .populate("author")
      .populate("insertedBy")
      .populate("tags")
      .populate("areasAvailable")
      .populate("departmentAffected")
      .populate("strategicAlignment");

    return res.status(201).json(await genericChallengeFilter(updatedChallenge));
  }
);
