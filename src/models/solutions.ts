import { Schema, model } from 'mongoose';

export type TYPE_SOLUTION = {
  solutionId: string,
  challengeId?: string,
  authorEmail: string,
  created: Date,
  updated?:Date,
  description: string,
  images: Array<string>,
  canChooseScope:boolean,
  active: boolean,
  isPrivate:boolean,
  status: string,
  timeInPark: number,
  baremoValidator?: Array<String>,
  baremoReferrer?: String,
  fileName: String
  calification?: {
    complexity: Number,
    impact: Number,
  },
  reactions?: {
    likes: Number,
    confused: Number,
  },
  // lodash methods
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
