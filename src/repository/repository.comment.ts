import { CommentI } from "../models/interaction.comment";
import CommentService from "../services/Comment.service";

/**
 * Generic Comment post
 * @param comment Comment
 * @returns 
 */
export const newComment = async (comment: CommentI): Promise<CommentI> => {
  try{
    const resp = await CommentService.newComment(comment)
    return Promise.resolve(resp)
  }catch(error){
    return Promise.reject(error)
  }
}