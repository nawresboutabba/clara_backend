import { model, Schema } from "mongoose";
import { z } from "zod";
import { UserI } from "../users/user.model";

export const BaremaValueKind = z.enum(["scale", "bool"]);
export type BaremaValueKind = z.infer<typeof BaremaValueKind>;

export const BaremaType = z.enum(["product", "process", "business"]);
export type BaremaType = z.infer<typeof BaremaType>;

export const BaremaAxis = z.enum(["difficulty", "impact"]);
export type BaremaAxis = z.infer<typeof BaremaAxis>;

export interface BaremaI {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  insertedBy: UserI;
  archivedBy: UserI;
  archivedAt: Date | null;

  title: string;
  description: string;
  valueKind: BaremaValueKind;
  weight: number;
  type: BaremaType;
  axis: BaremaAxis;
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
