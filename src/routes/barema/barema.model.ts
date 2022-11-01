import { model, Schema } from "mongoose";
import { UserI } from "../../models/users";

export interface BaremaI {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  insertedBy: UserI;
  archivedBy: UserI;
  archivedAt: Date | null;

  title: string;
  description: string;
  valueKind: "scale" | "bool";
  weight: number;
  type: "product" | "process" | "business";
  axis: "difficulty" | "impact";
}

const barema = new Schema<BaremaI>({
  title: String,
  description: String,
  valueKind: String,
  weight: Number,
  type: String,
  axis: String,

  insertedBy: { type: Schema.Types.ObjectId, ref: "User" },
  archivedBy: { type: Schema.Types.ObjectId, ref: "User" },
  archivedAt: { type: Date, default: null },
});

export const Barema = model<BaremaI>("Barema", barema);
export default Barema;
