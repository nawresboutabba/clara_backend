import { Schema, model } from 'mongoose';

export type TYPE_SOLUTION = {
  /**
   * Id that uniquely identifies a solution
   */
  solutionId: string,
  /**
   * Id that identify the challenge associated. If undefinedn then solution
   * was an initiative of a generator
   */
  challengeId?: string,
  /**
   * Generator that create the solution
   */
  authorEmail: string,
  /**
   * Solution creation date
   */
  created: Date,
  /**
   * Solution update date
   */
  updated?:Date,
  /**
   * Solution description
   */
  description: string,
  /**
   * Solution images
   */
  images: Array<string>,
  /**
   * If true, solution's generator can choose if the 
   * solution is shared with the community
   */
  canChooseScope:boolean,
  /**
   * Flag that indicate if a solution is active.
   * When a challenge is delete, the flag is false
   */
  active: boolean,
  /**
   * Solution is shared with the community?
   */
  isPrivate:boolean,
  /**
   * Solution status @TODO do the solution status
   */
  status: string,
  /**
   * TimePeriod that challenge is in a Park for discussion
   */
  timeInPark: number,
  /**
   * Refers to baremos did it by validators
   */
  baremoValidator?: Array<String>,
  /**
   * Refer to baremo did it by referrer
   */
  baremoReferrer?: string,
  /**
   * Filename submited by generator
   */
  fileName: string
  /**
   * Calification summary (baremo average)
   */
  calification?: {
    complexity: number,
    impact: number,
  },
  /**
   * Reactions in park
   */
  reactions?: {
    likes: number,
    confused: number,
  },
  /**
   * lodash methods
   */ 
  toJSON?: any
}

const solution = new Schema({
  solutionId: String,
  challengeId: String,
  authorEmail: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  description: String,
  images: [
    {
      type: String,
    },
  ],
  canChooseScope: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  status: String,
  timeInPark: {
    type: Number,
    default: null,
  },
  fileName: String,
  baremoValidator: [
    {
      type: String,
    },
  ],
  baremoReferrer: [
    {
      type: String,
    },
  ],
  calification: {
    complexity: Number,
    impact: Number,
  },
  reactions: {
    likes: Number,
    confused: Number,
  },
});

export default model("Solution", solution);
