import { UserI } from "../routes/users/user.model";
import { model, Schema } from "mongoose";

export interface VisitI {
  user: UserI;
  visitDate: Date;
  title: string;
  images: string;
  type: "CHALLENGE" | "SOLUTION";
  resource: any;
}

const visit = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  visitDate: Date,
  title: String,
  images: String,
  type: String,
  resource: {
    type: Schema.Types.ObjectId,
    ref: "SituationBase",
  },
});

export default model("Visit", visit);
