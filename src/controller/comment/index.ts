import { TagSerialized } from "../../routes/tags/tags.serializer";
import { InteractionBody, InteractionResponse } from "../interaction";

export interface CommentBody extends InteractionBody {
    comment: string,
    // version: string,
    scope: string,
}

export interface CommentResponse extends InteractionResponse {
    id: string
    comment: string,
    // version: string,
    tag: TagSerialized,
    scope: string,
    parent?: CommentResponse
}
