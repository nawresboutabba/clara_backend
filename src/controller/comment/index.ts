import { InteractionResponse } from "../interaction";

export interface CommentBody {
    author: string
    comment: string
}

export interface CommentResponse extends InteractionResponse{
    comment: string,
}