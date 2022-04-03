import { Schema, model } from "mongoose";
import { ChallengeI } from "./situation.challenges";
import { SolutionI } from "./situation.solutions";
import { UserI } from "./users";

export const options = { 
  discriminatorKey: 'itemtype', 
  collection: 'interactions' 
};

export interface InteractionBaseI {
    insertedBy: UserI,
    author: UserI,
    date: Date,
    type: string,
    challenge?: ChallengeI,
    solution?: SolutionI
}

const interactionBase = new Schema({
  insertedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date,
  type: String,
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  solution: {
    type: Schema.Types.ObjectId,
    ref: 'Solution'
  },
},options)

export default model("InteractionBase", interactionBase);