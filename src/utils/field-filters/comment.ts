import { CommentResponse } from "../../controller/comment";
import { CommentI } from "../../models/interaction.comment";
import { genericUserFilter } from "./user";

export const genericCommentFilter = async (commentEntity: CommentI): Promise<CommentResponse> => {
  try{
    const {
      commentId,
      comment,
      date,
      isPrivate
    } = commentEntity
    const author = await genericUserFilter(commentEntity.author)
    const resp: CommentResponse = {
      comment_id: commentId, 
      comment,
      date, 
      author,
      is_private: isPrivate
    }
    if (commentEntity.author.userId == commentEntity.insertedBy.userId){
      return Promise.resolve({... resp})
    }
    const insertedBy = await genericUserFilter(commentEntity.insertedBy)

    resp.insertedBy = insertedBy
    return Promise.resolve({...resp})
  }catch(error){
    return Promise.reject(error)
  }
}

export const genericArrayCommentFilter = async(comments: CommentI[]): Promise<CommentResponse[]> =>{
  return new Promise(async (resolve, reject)=> {
    const arrayComment: Array<Promise<CommentResponse>>= []
    comments.forEach(comment => {
      arrayComment.push(genericCommentFilter(comment))
    })
    await Promise
      .all(arrayComment)
      .then(result => {
        return resolve(result)
      })
      .catch(error=> {
        return reject(error)
      })  
  })
}