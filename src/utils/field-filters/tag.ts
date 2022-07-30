import { TagResponse } from "../../controller/tag";
import { TagI } from "../../models/tag";

export function genericTagFilter(tag: TagI): TagResponse {
  return {
    tag_id: tag.tagId,
    name: tag.name,
    description: tag.description,
    // created: tag.created,
  };
}

export function genericArrayTagsFilter(tags: TagI[]) {
  return tags.map(genericTagFilter);
}
