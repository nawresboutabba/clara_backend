import { nanoid } from "nanoid";
import { TagBody, TagResponse } from "../controller/tag";
import TagService from "../services/Tag.service";
import * as _ from "lodash";
import { getCurrentDate } from "../utils/general/date";
import { Tag } from "../models/tag";
import {
  genericArrayTagsFilter,
  genericTagFilter,
} from "../utils/field-filters/tag";
import { UserI } from "../models/users";
import { TAG_ORIGIN, URLS } from "../constants";

const handler = {
  get(target, prop) {
    if (prop === "name") {
      const value = target.name;
      if (value) {
        return value;
      } else {
        return `.*.*`;
      }
    }
  },
};

export const newTag = async (
  tagBody: TagBody,
  user: UserI
): Promise<TagResponse> => {
  try {
    const newTag = await Tag.create({
      ...tagBody,
      created: getCurrentDate(),
      tagId: nanoid(),
      creator: user,
    });
    const resp = genericTagFilter(newTag);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTags = async (
  query: any,
  url: string
): Promise<TagResponse[]> => {
  try {
    let tag_type: string;
    const urlFixed = url.split("?")[0];
    switch (urlFixed) {
    case URLS.TAG.CHALLENGE:
      tag_type = TAG_ORIGIN.CHALLENGE;
      break;
    case URLS.TAG.COMMENT:
      tag_type = undefined;
      break;
    case URLS.TAG.IDEA:
      tag_type = undefined;
      break;
    default:
      return Promise.reject();
    }

    const queryCleaned = new Proxy(query, handler);
    const mongooseQuery = {
      ..._.pickBy(
        {
          name: {
            $regex: `(?i).*${queryCleaned.name}.*`,
          },
          type: tag_type,
        },
        _.identity
      ),
    };
    const tags = await TagService.getTagsByQuery(mongooseQuery);
    const resp = await genericArrayTagsFilter(tags);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};
