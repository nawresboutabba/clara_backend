import { query } from "express-validator";
import TagService from "../../services/Tag.service";

export function tagsValidArray(field = "tags") {
  return query(field)
    .isArray()
    .optional()
    .custom(async (value: string[], { req }): Promise<void> => {
      try {
        if (value.length == 0) {
          return Promise.resolve();
        }
        // https://www.notion.so/TAGS-Fix-Tag-comments-according-to-10-th-meeting-dc0ee99aa6f9478daedcc35c0664a34d
        const query = {
          tagId: { $in: value },
        };
        const tags = await TagService.getTagsByQuery(query);

        if (tags.length == value.length) {
          req.utils = { tags, ...req.utils };
          return Promise.resolve();
        }
        return Promise.reject("tags does not valid");
      } catch (error) {
        return Promise.reject("tags does not valid");
      }
    });
}
