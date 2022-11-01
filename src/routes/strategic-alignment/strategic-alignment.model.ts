import { Schema, model, Types } from "mongoose";
import { UserI } from "../../models/users";

export interface StrategicAlignmentI {
  _id: Types.ObjectId;
  id?: string;
  description: string;
  insertedBy: UserI;
  startActive: Date;
  endActive: Date;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const StrategicAlignmentSchema = new Schema<StrategicAlignmentI>(
  {
    description: String,
    insertedBy: { type: Schema.Types.ObjectId, ref: "User" },
    startActive: Date,
    endActive: Date,
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);


export const StrategicAlignment = model<StrategicAlignmentI>("StrategicAlignment", StrategicAlignmentSchema);
