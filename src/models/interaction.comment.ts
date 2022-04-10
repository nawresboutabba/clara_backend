import { Schema } from "mongoose";
import InteractionBase, { InteractionBaseI, options } from "./interaction.base";


export interface CommentI extends InteractionBaseI{
  commentId: string
  comment: string,
  version: string,
  parent?: CommentI,
  /**
   * GROUP | PUBLIC
   */
  scope: string 
}


const Comment = InteractionBase.discriminator('Comment',new Schema({
  commentId: String, 
  comment: String,
  version: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  scope: String
}, options));

export default Comment