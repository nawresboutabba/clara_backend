import { Schema } from "mongoose";
import { options } from "./situation.base";
import SituationBase, { SituationBaseI } from "./situation.base";
import { CHALLENGE_STATUS } from "../constants";

export const CHALLENGE_TYPE = {
  GENERIC: "GENERIC",
  PARTICULAR: "PARTICULAR",
};
export type CHALLENGE_TYPE = keyof typeof CHALLENGE_TYPE;

export interface ChallengeI extends SituationBaseI {
  /**
   * GENERIC | PARTICULAR . Generic challenge is created for group ideas free.
   * Exist just one GENERIC CHALLENGE
   */
  type: CHALLENGE_TYPE;

  status: CHALLENGE_STATUS;
  /**
   * True or False. Work in combination with canChooseScope
   */
  defaultScope: boolean;
  /**
   * Id that uniquely identifies a challenge
   */
  challengeId: string;
  /**
   * Situation title
   */
  title: string;
  /**
   * If challenge response to strategic organization need.
   */
  isStrategic: boolean;
  /**
   * Challenge finalization. Time limit for submit Ideas.
   */
  finalization: Date;

  price: number;
  meta: string;
  resources: string;
  wanted_impact: string;
}

export const challengeModel = {
  type: String,
  defaultScope: Boolean,
  isStrategic: Boolean,
  finalization: Date,
  price: Number,
  meta: String,
  resources: String,
  wanted_impact: String,
};

const Challenge = SituationBase.discriminator<ChallengeI>(
  "Challenge",
  new Schema(challengeModel, options)
);

export default Challenge;
