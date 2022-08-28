import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Tag, { TagI } from "../models/tag";

const TagService = {
  async newTag(tag: TagI): Promise<TagI> {
    try {
      const resp = await Tag.create(tag);
      return resp.toObject();
    } catch (error) {
      throw new ServiceError(ERRORS.SERVICE.NEW_TAG, HTTP_RESPONSE._500, error);
    }
  },
  async getTagById(tagId: string): Promise<TagI> {
    try {
      const resp = await Tag.findOne({
        tagId: tagId,
      });
      return resp.toObject();
    } catch (error) {
      throw new ServiceError(ERRORS.SERVICE.GET_TAG, HTTP_RESPONSE._500, error);
    }
  },
  async getTagsById(tagsId: string[]): Promise<TagI[]> {
    try {
      const resp = await Tag.find({
        tagId: { $in: tagsId },
      });
      return resp.map((e) => e.toObject());
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_ARRAY_TAGS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getTagsByQuery(query: any): Promise<TagI[]> {
    try {
      const tags = await Tag.find({ ...query });
      return tags.map((e) => e.toObject());
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_ARRAY_TAGS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};
export default TagService;
