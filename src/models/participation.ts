import { Schema, model } from "mongoose";
import { UserI } from "../routes/users/user.model";

export interface ParticipationI {
  /**
   * User that earn points
   */
  user: UserI;
  /**
   * Action that was done
   */
  actionDescription: string;
  /**
   * Date that the points was earned
   */
  date: Date;
  /**
   * Points earned for activities
   */
  points: number;
}

const user = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  actionDescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
});
export default model("User", user);
