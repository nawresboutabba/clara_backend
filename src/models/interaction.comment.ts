import { Schema } from "mongoose";
import InteractionBase, { InteractionBaseI, options } from "./interaction.base";


export interface CommentI extends InteractionBaseI{
  commentId: string
  comment: string,
  isPrivate: boolean,
  parent?: CommentI
}


const Comment = InteractionBase.discriminator('Comment',new Schema({
  commentId: String, 
  comment: String,
  isPrivate: {
    type: Boolean,
    default: false
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, options));

export default Comment