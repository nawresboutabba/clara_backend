import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import Comment, { CommentI } from "../models/interaction.comment";

const CommentService = {
  async newComment(comment: CommentI): Promise<any> {
    try {
      const resp = await Comment.create({
        ...comment,
      });
      return resp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.POST_COMMENT_FAIL,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getParentsComments(filter: any): Promise<any> {
    try {
      const comments = await Comment.find({
        ...filter,
        parent: undefined,
      })
        .populate("author")
        .populate("insertedBy")
        .populate("tag");
      return comments;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_COMMENTS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getChildrenComments(comments: CommentI[]): Promise<any> {
    try {
      const resp = await Comment.find({
        parent: { $in: comments },
      })
        .populate("parent")
        .populate("author")
        .populate("insertedBy");
      return resp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_COMMENTS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getChildComments(commentparent: CommentI): Promise<any> {
    try {
      const comments = await Comment.find({
        parent: commentparent,
      });

      return comments;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_COMMENTS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getComment(commentId: string): Promise<any> {
    try {
      const comment = await Comment.findOne({
        commentId,
      })
        .populate("author")
        .populate("insertedBy")
        .populate("parent")
        .populate("tag")
        .populate("solution")
        .populate("challenge");
      return comment;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_COMMENT,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getComments(filter: any) {
    return Comment.find(filter)
      .populate("author")
      .populate("insertedBy")
      .populate("parent")
      .populate("tag")
      .sort({ created: "asc" })
      .limit(10);
  },
};

export default CommentService;
