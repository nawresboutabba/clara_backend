import { FilterQuery } from "mongoose";
import { z } from "zod";
import { Tag, TagI, TAG_TYPE } from "../../models/tag";
import { validate } from "../../utils/express/express-handler";
import { removeEmpty } from "../../utils/general/remove-empty";
import { genericArrayTagsFilter, genericTagFilter } from "./tags.serializer";

export const getTags = validate({
  query: z.object({
    q: z.string(),
    type: z.nativeEnum(TAG_TYPE)
  }).partial()
}, async ({ query: { q, type } }) => {
  const filterQuery: FilterQuery<TagI> = Object.assign(
    removeEmpty({ type }),
    q && {
      $text: { $search: q },
    }
  )
  const tags = await Tag.find(filterQuery)

  return genericArrayTagsFilter(tags)
})

export const createTag = validate({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    type: z.nativeEnum(TAG_TYPE)
  })
}, async ({ body, user }) => {
  const newTag = await Tag.create({
    ...body,
    creator: user,
  })

  return genericTagFilter(newTag);
})
