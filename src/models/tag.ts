import { Schema, model } from "mongoose";

export interface TagI {
    tagId: string,
    name: string,
    created: Date,
    description: string
}

const tag = new Schema({
  tagId: String,
  name: String,
  created: Date,
  description: String
})

export default model('Tag', tag);