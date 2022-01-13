import { InteractionBody, InteractionResponse } from "../interaction";

export interface CommentBody extends InteractionBody {
    comment: string,
    is_private: boolean
}

export interface CommentResponse extends InteractionResponse{
    comment: string,
    is_private: boolean
}