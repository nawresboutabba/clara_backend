import { query } from "express-validator";
import TagService from "../../services/Tag.service";

export function tagsValidArray(field = "tags") {
  return query(field)
    .isArray()
    .custom(async (value: string[], { req }): Promise<void> => {
      if (value.length === 0) {
        return;
      }
      // https://www.notion.so/TAGS-Fix-Tag-comments-according-to-10-th-meeting-dc0ee99aa6f9478daedcc35c0664a34d
      const tags = await TagService.getTagsById(value);

      if (tags.length == value.length) {
        req.utils = { tags, ...req.utils };
        return;
      }
      throw new Error("tags does not valid");
    });
}
