import { Schema } from "mongoose";
import { z } from "zod";
import { AreaI } from "../area/area.model";
import SituationBase, {
  options,
  SituationBaseI,
} from "../../models/situation.base";
import { UserI } from "../users/user.model";
import { StrategicAlignmentI } from "../strategic-alignment/strategic-alignment.model";

export enum CHALLENGE_TYPE {
  GENERIC = "GENERIC",
  PARTICULAR = "PARTICULAR",
}
export type CHALLENGE_TYPE_TYPE = keyof typeof CHALLENGE_TYPE;

export const CHALLENGE_STATUS_ENUM = z.enum([
  "DRAFT",
  "PROPOSED",
  "OPENED",
  "CLOSED",
]);
export type CHALLENGE_STATUS_ENUM = z.infer<typeof CHALLENGE_STATUS_ENUM>;

export const IDEA_BEHAVIOR_ENUM = z.enum([
  "WITH_PARK",
  "WITHOUT_FORUM",
  "WITHOUT_PARK",
]);
export type IDEA_BEHAVIOR_ENUM = z.infer<typeof IDEA_BEHAVIOR_ENUM>;

export const TARGET_AUDIENCE_ENUM = z.enum(["Company", "Area", "User"]);
export type TARGET_AUDIENCE_ENUM = z.infer<typeof TARGET_AUDIENCE_ENUM>;

export type ChallengeI = SituationBaseI & {
  /**
   * GENERIC | PARTICULAR . Generic challenge is created for group ideas free.
   * Exist just one GENERIC CHALLENGE
   */
  type: CHALLENGE_TYPE;

  status: CHALLENGE_STATUS_ENUM;
  /**
   * Situation title
   */
  title: string;
  /**
   * Challenge finalization. Time limit for submit Ideas.
   */
  finalization: Date;

  price: number;
  goal: string;
  resources: string;
  wanted_impact: string;
  /**
   * Alignment of the challenge with the company alignments
   */
  strategicAlignment: StrategicAlignmentI;
  ideaBehavior: IDEA_BEHAVIOR_ENUM;
  targetAudience: TARGET_AUDIENCE_ENUM;
  targetAudienceValue: AreaI[] | UserI[];
};

export const challengeModel = {
  type: String,
  defaultScope: Boolean,
  isStrategic: Boolean,
  finalization: Date,
  price: Number,
  goal: String,
  resources: String,
  wanted_impact: String,
  targetAudience: {
    type: String,
    required: true,
    enum: TARGET_AUDIENCE_ENUM.options,
  },
  targetAudienceValue: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetAudience",
      default: [],
    },
  ],
  ideaBehavior: String,
  strategicAlignment: {
    type: Schema.Types.ObjectId,
    ref: "StrategicAlignment",
  },
};

const Challenge = SituationBase.discriminator<ChallengeI>(
  "Challenge",
  new Schema(challengeModel, options)
);

export default Challenge;
