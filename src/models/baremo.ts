import { Schema, model } from "mongoose";
import { SolutionI } from "../routes/solutions/solution.model";
import { UserI } from "./users";

export interface BaremoI {
  baremoId: string;
  user: UserI;
  solution: SolutionI;
  created: Date;
  updated: Date;
  status: string;
  type: "SPECIALIST_INTERVENTION" | "GROUP_VALIDATOR";
  comment: string;
}

const baremo = new Schema<BaremoI>({
  baremoId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  solution: {
    type: Schema.Types.ObjectId,
    ref: "Solution",
  },
  created: Date,
  updated: Date,
  status: String,
  type: String,
  comment: String,
});

export const Barema = model<BaremoI>("Baremo", baremo);
export default Barema;
