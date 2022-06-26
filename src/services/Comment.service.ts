import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Comment, { CommentI } from "../models/interaction.comment";

const CommentService = {
  async newComment (comment: CommentI) : Promise<any>{
    try{
      const resp = await Comment.create({
        ...comment
      })
      return Promise.resolve(resp)
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.POST_COMMENT_FAIL,
        HTTP_RESPONSE._500,
        error
      ))
    }
  },
  async getParentsComments(filter: any): Promise<any>{
    try{
      const comments = await Comment.find({
        ...filter,
        parent: undefined
      })
        .populate('author')
        .populate('insertedBy')
        .populate('tag')
      return Promise.resolve(comments)
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_COMMENTS,
        HTTP_RESPONSE._500,
        error
      ))
    }
  },
  async getChildrenComments(comments: CommentI[]): Promise<any>{
    try{
      const resp = await Comment.find({
        parent: {$in:comments }
      })
        .populate('parent')
        .populate('author')
        .populate('insertedBy')
      return Promise.resolve(resp)
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_COMMENTS,
        HTTP_RESPONSE._500,
        error
      ))
    }
  },
  async getChildComments(commentparent: CommentI): Promise<any>{
    try{
      const comments = await Comment.find({
        parent: commentparent
      })

      return Promise.resolve(comments)
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_COMMENTS,
        HTTP_RESPONSE._500,
        error
      ))
    }
  },
  async getComment(commentId: string): Promise<any> {
    try{
      const comment = await Comment.findOne({
        commentId
      })
        .populate('author')
        .populate('insertedBy')
        .populate('parent')
        .populate('tag')
        .populate('solution')
        .populate('challenge')
      return Promise.resolve(comment)
    }catch(error){
      return Promise.reject(new ServiceError(
        ERRORS.SERVICE.GET_COMMENT,
        HTTP_RESPONSE._500,
        error
      ))
    }
  }
}

export default CommentService