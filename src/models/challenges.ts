import { Schema, model } from 'mongoose';

/**
 * Challenge entity is a proposal that need a solution
 */
export type TYPE_CHALLENGE  = {
  /**
   * Author's Challenge
   */
  author: string,
  /**
   * Id that uniquely identifies a challenge
   */
  challengeId:string,
  /**
   * Area that challenge is relationated @TODO add departments as CONSTANTS
   */
  department: string,
  /**
   * If challenge response to strategic organization need.
   */
  isStrategic: boolean
  /**
   * Challenge creation date
   */
  created: Date,
  /**
   * Challenge Update date
   */
  updated?:Date,
  /**
   * Challenge description
   */
  description: String,
  /**
   * Flag that indicate if a challenge is active.
   * When a challenge is delete, the flag is false
   */
  active: boolean,
  /**
   * Challenge Images URL
   */
  images: Array<String>,
  /**
   * TimePeriod that challenge is in a Park for discussion. Dimenention is in hours. 
   * Then a challenge will be in a park Challenge create + timePeriod
   */
  timePeriod: number,
  /**
   * Challenge Status: @TODO define status challenge
   */
  status: string,
  /**
   * Committe Users who have the responsibility of managing the destination of the challenge 
   */
  validators: Array<String>,
  /**
   * Users who have the responsibility of managing an organization department.
   * Could be committe member or not.  Referrer work with validators because generally a challenge impact
   * is relationated with a organization area.
   */
  referrer: String,
  /**
   * Workspace is a concept that allows to manage resources access for users.
   * If a user and resources are in a same work space, then could be returned
   */
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