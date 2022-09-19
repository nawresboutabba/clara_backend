import { CommentResponse } from "../../controller/comment";
import { GeneralCommentI } from "../../models/interaction.comment";
import { genericTagFilter } from "../../routes/tags/tags.serializer";
import { genericUserFilter } from "./user";

export const genericCommentFilter = async (commentEntity: GeneralCommentI): Promise<CommentResponse> => {
  const {
    _id,
    comment,
    date,
    scope
  } = commentEntity
  const author = await genericUserFilter(commentEntity.author)
  const tag = genericTagFilter(commentEntity.tag)

  return {
    id: _id.toString(),
    comment,
    date,
    author,
    tag,
    scope,
    parent: commentEntity.parent ? await genericCommentFilter(commentEntity.parent) : null
  } as CommentResponse
}

export function genericArrayCommentFilter(comments: GeneralCommentI[]): Promise<CommentResponse[]> {
  return Promise.all(comments.map(genericCommentFilter));
}
