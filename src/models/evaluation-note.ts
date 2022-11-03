import { Schema, model } from "mongoose";
import { SolutionI } from "../routes/solutions/solution.model";
import { UserI } from "../routes/users/users.model";

export interface EvaluationNoteI {
  noteId: string;
  title: string;
  description: string;
  type: "GROUP_VALIDATOR" | "EXTERNAL_OPINION";
  created: Date;
  updated: Date;
  user: UserI;
  solution: SolutionI;
}

const evaluationNote = new Schema({
  noteId: String,
  title: String,
  description: String,
  type: String,
  created: Date,
  updated: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  solution: {
    type: Schema.Types.ObjectId,
    ref: "Solution",
  },
});

export default model("EvaluationNote", evaluationNote);
