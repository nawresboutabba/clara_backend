import { Schema } from "mongoose";
import SituationBase, { SituationBaseI, options } from "./situation.base";

export enum CHALLENGE_TYPE {
  GENERIC = "GENERIC",
  PARTICULAR = "PARTICULAR",
}
export type CHALLENGE_TYPE_TYPE = keyof typeof CHALLENGE_TYPE;

export enum CHALLENGE_STATUS {
  DRAFT = "DRAFT",
  PROPOSED = "PROPOSED",
  OPENED = "OPENED",
  CLOSED = "CLOSED",
}
export type CHALLENGE_STATUS_TYPE = keyof typeof CHALLENGE_STATUS;

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
  goal: string;
  resources: string;
  wanted_impact: string;
}

export const challengeModel = {
  type: String,
  defaultScope: Boolean,
  isStrategic: Boolean,
  finalization: Date,
  price: Number,
  goal: String,
  resources: String,
  wanted_impact: String,
};

const Challenge = SituationBase.discriminator<ChallengeI>(
  "Challenge",
  new Schema(challengeModel, options)
);

export default Challenge;
