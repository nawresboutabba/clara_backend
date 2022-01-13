import { InteractionResponse } from "../interaction";

export interface CommentBody {
    author: string,
    comment: string,
    is_private: boolean
}

export interface CommentResponse extends InteractionResponse{
    comment: string,
    is_private: boolean
}