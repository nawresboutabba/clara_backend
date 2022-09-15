import { TagResponse } from "../../controller/tag";
import { TagI } from "../../models/tag";

export function genericTagFilter(tag: TagI): TagResponse {
  return {
    id: tag._id,
    name: tag.name,
    description: tag.description,
  };
}

export function genericArrayTagsFilter(tags: TagI[]) {
  return tags.map(genericTagFilter);
}
