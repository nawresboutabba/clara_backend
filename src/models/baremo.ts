import { Schema, model } from "mongoose";
import { SolutionI } from "./situation.solutions";
import { UserI } from "./users";

export interface BaremoI {
    user: UserI
    solution: SolutionI,
    created: Date,
    updated: Date,
    status: string,
    type: 'SPECIALIST_INTERVENTION' | 'GROUP_VALIDATOR',
    comment: string
}

const baremo = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  solution: {
    type: Schema.Types.ObjectId,
    ref: 'Solution' 
  },
  created: Date,
  updated: Date,
  type: String,
  comment: String
})

baremo.index({intervention:1, solution:1}, {unique:true})

export default model('Baremo', baremo);