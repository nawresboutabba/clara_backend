import { InteractionBody, InteractionResponse } from "../interaction";

export interface ReactionBody extends InteractionBody {
    type: string
}
export interface ReactionResponse extends InteractionResponse {
    type: string,
}