import { Schema, model, Types } from "mongoose";
import { ChallengeI } from "../routes/challenges/challenge.model";
import { SolutionI } from "../routes/solutions/solution.model";
import { UserI } from "../routes/users/users.model";

export const options = {
  discriminatorKey: "type",
  collection: "interactions",
  timestamps: true,
};

export interface InteractionBaseI {
  insertedBy: UserI;
  author: UserI;
  date: Date;
  resource: ChallengeI | SolutionI;
}

const interactionBase = new Schema<InteractionBaseI>(
  {
    insertedBy: { type: Schema.Types.ObjectId, ref: "User" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    date: Date,
    resource: Types.ObjectId,
  },
  options
);

export const InteractionBase = model<InteractionBaseI>(
  "InteractionBase",
  interactionBase
);
