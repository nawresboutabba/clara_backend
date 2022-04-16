import { TagResponse } from "../../controller/tag";
import { TagI } from "../../models/tag";

export const genericTagFilter = async (tag: TagI): Promise<TagResponse> => {
  try{
    const resp = {
      tag_id: tag.tagId,
      name: tag.name,
      description : tag.description,
      created: tag.created
    }
    return resp
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArrayTagsFilter= async (tags: TagI [] ): Promise<TagResponse[]> => {
  try{
    const arrayTags: Array<Promise<TagResponse>>= []
    if (!tags){
      return []
    }
    tags.forEach(tag => {
      arrayTags.push(genericTagFilter(tag))
    })
    return await Promise
      .all(arrayTags)
      .then(result => {
        return result
      })
      .catch(error=> {
        return Promise.reject(error)
      })
  }catch(error){
    return Promise.reject(error)
  }
}