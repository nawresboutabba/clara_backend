import { Schema, model } from "mongoose";
import { UserI } from "../users/users.model";

export interface AreaI {
  name: string;

  _id: Schema.Types.ObjectId;
  id: string;
  insertedBy: UserI;
  archivedBy: UserI;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const area = new Schema<AreaI>({
  name: { type: String, required: true, unique: true },
  insertedBy: { type: Schema.Types.ObjectId, ref: "User" },
  archivedBy: { type: Schema.Types.ObjectId, ref: "User" },
  archivedAt: { type: Date, default: null },
});

export const Area = model<AreaI>("Area", area);
