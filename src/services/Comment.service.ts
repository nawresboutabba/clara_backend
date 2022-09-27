import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import { GeneralComment, GeneralCommentI } from "../models/interaction.comment";

const CommentService = {
  async newComment(comment: GeneralCommentI): Promise<any> {
    try {
      const resp = await GeneralComment.create({
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
      const comments = await GeneralComment.find({
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
  async getChildrenComments(comments: GeneralCommentI[]): Promise<any> {
    try {
      const resp = await GeneralComment.find({
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
  async getChildComments(commentparent: GeneralCommentI): Promise<any> {
    try {
      const comments = await GeneralComment.find({
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
  async getComment(commentId: string) {
    try {
      const comment = await GeneralComment.findById(commentId)
        .populate("author")
        .populate("insertedBy")
        .populate("parent")
        .populate("tag")
        .populate("resource")
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
    return GeneralComment.find(filter)
      .populate("author")
      .populate("insertedBy")
      .populate("parent")
      .populate("tag")
      .sort({ created: "asc" })
      .limit(10);
  },
};

export default CommentService;
