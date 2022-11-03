import { Schema, model, Types } from "mongoose";
import { UserI } from "../routes/users/users.model";

export enum TAG_TYPE {
  COMMENT = "COMMENT",
  SITUATION = "SITUATION",
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

const TagSchema = new Schema<TagI>(
  {
    name: { type: String },
    description: String,
    type: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

TagSchema.index({ name: "text" });
TagSchema.index({ name: 1, type: 1 }, { unique: true });

export const Tag = model<TagI>("Tag", TagSchema);
