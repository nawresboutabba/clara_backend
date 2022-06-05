import { Schema, model } from "mongoose";
import { UserI } from "./users";

export interface TagI {
    tagId: string,
    name: string,
    created: Date,
    description: string,
    /**
     * COMMENT | IDEA | CHALLENGE
     */
    type: string,
    creator: UserI
}

const tag = new Schema({
  tagId: String,
  name: String,
  created: Date,
  description: String,
  type: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },  
})

export default model('Tag', tag);