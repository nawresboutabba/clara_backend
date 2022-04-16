import { nanoid } from "nanoid";
import { TagBody, TagResponse } from "../controller/tag";
import TagService from "../services/Tag.service";
import * as _ from 'lodash'; 
import { getCurrentDate } from "../utils/date";
import { TagI } from "../models/tag";
import { genericArrayTagsFilter, genericTagFilter } from "../utils/field-filters/tag";

const handler = {
  get(target, prop) {
    if (prop === "name") {
      const value = target.name
      if(value){
        return value
      }else{
        return `.*.*`
      }
    }
  },
};



export const newTag = async (tagBody: TagBody) : Promise<TagResponse> => {
  try{
    const tag : TagI= {
      ...tagBody,
      created: getCurrentDate(),
      tagId: nanoid()
    }
    const newTag = await TagService.newTag(tag)
    const resp = await genericTagFilter(newTag)
    return resp
  }catch(error){
    return Promise.reject(error)
  }
}

export const getTags = async (query: any): Promise<TagResponse[]> => {
  try{

    const queryCleaned = new Proxy(query, handler);
    const mongooseQuery = {..._.pickBy({
      name:{
        $regex : `(?i).*${queryCleaned.name}.*`, 
      }
    }, _.identity),
    }
    const tags = await TagService.getTagsByQuery(mongooseQuery)
    const resp = await genericArrayTagsFilter(tags)
    return resp
  }catch(error){
    return Promise.reject(error)
  }
}