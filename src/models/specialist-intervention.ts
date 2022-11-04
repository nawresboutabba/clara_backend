import { Schema, model } from "mongoose";
import { BaremaI } from "../routes/barema/barema.model";
import { GroupValidatorI } from "./group-validator";
import { ChallengeI } from "../routes/challenges/challenge.model";
import { SolutionI } from "../routes/solutions/solution.model";
import { UserI } from "../routes/users/user.model";

export interface SpecialistInterventionI {
  groupValidator: GroupValidatorI;
  user: UserI;
  baremo: BaremaI;
  situation: ChallengeI | SolutionI;
}

const specialistIntervention = new Schema({
  groupValidator: {
    type: Schema.Types.ObjectId,
    ref: "GroupValidator",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  baremo: {
    type: Schema.Types.ObjectId,
    ref: "Baremo",
  },
  situation: {
    type: Schema.Types.Mixed,
  },
});

specialistIntervention.index({ situation: 1, user: 1 }, { unique: true });

export default model("Baremo", specialistIntervention);
