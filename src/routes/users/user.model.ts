import { Schema, model } from "mongoose";
import { AreaI } from "../area/area.model";

export interface UserI {
  /**
   * Mongo Document Id
   */
  _id?: string;
  /**
   * User Image
   */
  userImage?: string;
  /**
   * Username
   */
  username: string;
  /**
   * User email
   */
  email: string;
  /**
   * Business User Id
   */
  userId: string;
  /**
   * Password encrypted
   */
  password: string;
  /**
   * user first name
   */
  firstName: string;
  /**
   * User linkedIn
   */
  linkedIn?: string;
  /**
   * User bio
   */
  about?: string;
  /**
   * User last name
   */
  lastName: string;
  /**
   * User confirmed?
   */
  confirmed: boolean;
  /**
   * Is the user active?
   */
  active: boolean;
  /**
   * External User. If true is external user that has participation in OpenChallenges
   */
  externalUser: boolean;
  /**
   * Area that is visible for user
   */
  areaVisible?: Array<AreaI>;
  /**
   * Last user update
   */
  updated?: Date;
  /**
   * Resume: Points earned for participation in platform.
   */
  points: number;
}

const user = new Schema<UserI>({
  userImage: String,
  username: String,
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
  linkedIn: String,
  about: String,
  confirmed: Boolean,
  active: Boolean,
  externalUser: Boolean,
  areaVisible: [
    {
      type: Schema.Types.ObjectId,
      ref: "Area",
    },
  ],
  updated: Date,
  points: {
    type: Number,
    default: 0,
  },
});

const User = model("User", user);

export default User;
