import { CommentResponse } from "../../controller/comment";
import { CommentI } from "../../models/interaction.comment";
import { genericUserFilter } from "./user";

export const genericCommentFilter = async (commentEntity: CommentI): Promise<CommentResponse> => {
  try{
    const {
      commentId,
      comment,
      date,
      scope
    } = commentEntity
    const author = await genericUserFilter(commentEntity.author)

    let resp: CommentResponse = {
      comment_id: commentId, 
      comment,
      date, 
      author,
      scope
    }
/*     if (commentEntity.author.userId == commentEntity.insertedBy.userId){
      return Promise.resolve({... resp})
    }
    const insertedBy = await genericUserFilter(commentEntity.insertedBy)

    resp.insertedBy = insertedBy */

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