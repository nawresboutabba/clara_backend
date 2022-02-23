import { Schema } from "mongoose";
import InteractionBase, { InteractionBaseI, options } from "./interaction.base";


export interface CommentI extends InteractionBaseI{
  comment: string,
  isPrivate: boolean
}


const Comment = InteractionBase.discriminator('Comment',new Schema({
  comment: String,
  isPrivate: {
    type: Boolean,
    default: false
  },
}, options));

export default Comment