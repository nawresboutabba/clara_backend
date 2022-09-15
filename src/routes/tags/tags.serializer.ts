import { Types } from "mongoose";
import { TagI } from "../../models/tag";

export interface TagSerialized {
  id: Types.ObjectId
  name: string,
  description: string,
}

export function genericTagFilter(tag: TagI): TagSerialized {
  return {
    id: tag._id,
    name: tag.name,
    description: tag.description,
  };
}

export function genericArrayTagsFilter(tags: TagI[]) {
  return tags.map(genericTagFilter);
}
