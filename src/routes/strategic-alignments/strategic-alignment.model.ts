import { Schema, model, Types } from "mongoose";
import { UserI } from "../users/user.model";

export interface StrategicAlignmentI {
  _id: Types.ObjectId;
  id: string;
  insertedBy: UserI;
  archivedBy: UserI;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  description: string;
  startActive: Date;
  endActive: Date;
}

const StrategicAlignmentSchema = new Schema<StrategicAlignmentI>(
  {
    description: String,
    startActive: Date,
    endActive: Date,
    insertedBy: { type: Schema.Types.ObjectId, ref: "User" },
    archivedBy: { type: Schema.Types.ObjectId, ref: "User" },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const StrategicAlignment = model<StrategicAlignmentI>(
  "StrategicAlignment",
  StrategicAlignmentSchema
);
