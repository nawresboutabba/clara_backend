import { body, query } from "express-validator";
import * as TagsRep from "../../routes/tags/tags.repository";

export async function validateTagsArray(value: string[], { req }) {
  if (value.length === 0) {
    return;
  }
  // https://www.notion.so/TAGS-Fix-Tag-comments-according-to-10-th-meeting-dc0ee99aa6f9478daedcc35c0664a34d
  const tags = await TagsRep.getTagsById(value);

  if (tags.length == value.length) {
    req.utils = { tags, ...req.utils };
    return;
  }
  throw new Error("tags does not valid");
}

export function tagsBodyCheck(field = "tags") {
  return body(field).isArray().custom(validateTagsArray);
}
