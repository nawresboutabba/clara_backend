import { InteractionBody, InteractionResponse } from "../interaction";
import { TagResponse } from "../tag";

export interface CommentBody extends InteractionBody {
    comment: string,
    version: string,
    scope: string,
}

export interface CommentResponse extends InteractionResponse{
    comment_id: string
    comment: string,
    version: string, 
    tag: TagResponse,
    scope: string,
    parent?: CommentResponse
}