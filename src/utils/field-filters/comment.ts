import { CommentResponse } from "../../controller/comment";
import { CommentI } from "../../models/interaction.comment";
import { genericTagFilter } from "./tag";
import { genericUserFilter } from "./user";

export const genericCommentFilter = async (commentEntity: CommentI): Promise<CommentResponse> => {
  try{
    const {
      commentId,
      comment,
      date,
      version,
      scope
    } = commentEntity
    const author = await genericUserFilter(commentEntity.author)
    const tag = await genericTagFilter(commentEntity.tag)
    let resp: CommentResponse = {
      comment_id: commentId, 
      comment,
      date, 
      author,
      tag,
      version,
      scope
    }

    if (commentEntity.parent) {
      const parent = await genericCommentFilter(commentEntity.parent)
      resp = {...resp, parent}
    }


    return Promise.resolve({...resp})
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArrayCommentFilter = async(comments: CommentI[]): Promise<CommentResponse[]> =>{
  const arrayComment: Array<Promise<CommentResponse>>= []
  comments.forEach(comment => {
    arrayComment.push(genericCommentFilter(comment))
  })
  return await Promise
    .all(arrayComment)
    .then(result => {
      return result
    })
    .catch(error=> {
      return Promise.reject(error)
    })  
}