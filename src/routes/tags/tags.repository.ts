import { Tag } from "../../models/tag";


export function getTagsById(tagsId: string[]) {
  return Tag.find({
    _id: { $in: tagsId }
  });

}
