import { Schema } from "mongoose";
import InteractionBase, { InteractionBaseI, options } from "./interaction.base";
import { TagI } from "./tag";


export interface CommentI extends InteractionBaseI{
  commentId: string
  comment: string,
  version: string,
  tag: TagI,
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
  tag:{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  scope: String
}, options));

export default Comment