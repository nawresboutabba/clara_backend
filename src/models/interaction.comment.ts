import { Schema } from "mongoose";
import InteractionBase, { InteractionBaseI, options } from "./interaction.base";


export interface CommentI extends InteractionBaseI{
  comment: string
}


const Comment = InteractionBase.discriminator('Comment',new Schema({
    comment: String
  }, options));

  export default Comment