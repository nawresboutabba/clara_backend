import { Schema, model } from 'mongoose';

export type TYPE_USER = {
  /**
   * Mongo Document Id
   */
  _id?: string,
  /**
   * User email
   */
  email: string,
  /**
   * Business User Id
   */
  userId: string,
  /**
   * Password encrypted
   */
  password: string,
  /**
   * user first name
   */
  firstName: string,
  /**
   * User last name
   */
  lastName: string,
  /**
   * Is the user active?
   */
  active: boolean,
  /**
   * Workspace that user could be explore
   */
  workSpace: Array<string>,
  /**
   * Last user update
   */
  updated?: Date
}

const user = new Schema({
  active: Boolean,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  password: { type: String, required: true },
  firstName: String,
  lastName: String, 
  workSpace: [
    {
      type: String,
    },
  ],
  updated: Date,
});
export default model("User", user);
