import { GeneralCommentI } from "../models/interaction.comment";
import CommentService from "../services/Comment.service";
import {
  genericArrayCommentFilter,
  genericCommentFilter,
} from "../utils/field-filters/comment";

/**
 * Generic Comment post
 * @param comment Comment
 * @returns
 */
export const newComment = async (comment: GeneralCommentI): Promise<GeneralCommentI> => {
  try {
    const resp = await CommentService.newComment(comment);
    return Promise.resolve(resp);
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function getThreadComments(commentId: string) {
  try {
    const comment = await CommentService.getComment(commentId);

    const resp = await genericCommentFilter(comment);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getComments(filter: any) {
  try {
    const parents = await CommentService.getParentsComments(filter);

    const parentsFiltered = await genericArrayCommentFilter(parents);

    const allChildren = await CommentService.getChildrenComments(parents);

    const allChildrenFiltered = await genericArrayCommentFilter(allChildren);

    const complete = parentsFiltered.map((parent) => {
      const children = allChildrenFiltered.filter(
        (child) => child?.parent?.id == parent.id
      );
      return { ...parent, children };
    });

    return complete;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getCommentsWithoutRelation(filter: any) {
  const comments = await CommentService.getComments(filter);
  return genericArrayCommentFilter(comments as unknown as GeneralCommentI[]);
}
