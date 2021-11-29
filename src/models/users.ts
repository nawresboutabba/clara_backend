import { Schema, model } from 'mongoose';

export type TYPE_USER = {
  _id?: string,
  email: string,
  userId: string,
  password: string,
  firstName: string,
  lastName: string,
  active: boolean,
  workSpace: Array<string>,
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
