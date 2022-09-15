import { Schema, model, Types } from "mongoose";
import { UserI } from "./users";

export enum TAG_TYPE {
  COMMENT = "COMMENT",
  IDEA = "IDEA",
  CHALLENGE = "CHALLENGE",
}
export type TAG_TYPE_TYPE = keyof typeof TAG_TYPE;

export interface TagI {
  _id: Types.ObjectId;
  name: string;
  description: string;
  type: TAG_TYPE_TYPE;
  creator: UserI;
  createdAt: Date;
  updatedAt: Date;
}

const tag = new Schema<TagI>(
  {
    name: String,
    description: String,
    type: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tag = model("Tag", tag);
