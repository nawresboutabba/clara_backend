import { CommentI } from "../models/interaction.comment";
import CommentService from "../services/Comment.service";
import { genericArrayCommentFilter } from "../utils/field-filters/comment";

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

export const getComments = async (filter: any ): Promise<any> => {
  try{
    const parents = await CommentService.getParentsComments(filter)

    const parentsFiltered = await genericArrayCommentFilter(parents)

    const allChilds = await CommentService.getChildsComments(parents)

    const allChildsFiltered = await genericArrayCommentFilter(allChilds)

    const complete = parentsFiltered.map(parent => {
      const childs = allChildsFiltered.filter(child => 
        child?.parent?.comment_id == parent.comment_id)
      return { ...parent, childs}
    })

    return complete
  }catch(error){
    return Promise.reject(error)
  }
}