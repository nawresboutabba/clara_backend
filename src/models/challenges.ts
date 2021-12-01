import { Schema, model } from 'mongoose';

export type TYPE_CHALLENGE  = {
  author: string,
  challengeId:string,
  created: Date,
  updated?:Date,
  description: String,
  active: boolean,
  images: Array<String>,
  timePeriod: number,
  status: string,
  validators: Array<String>,
  referrer: String,
  workSpaceAvailable: Array<String>
}

const challenge = new Schema({
  author: String,
  challengeId: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  description: String,
  active: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
    },
  ],
  timePeriod: Number,
  status: String,
  validators: [
    {
      type: String,
    },
  ],
  referrer: String,
  workSpaceAvailable: [
    {
      type: String,
    },
  ],
});

export default model("Challenge", challenge);