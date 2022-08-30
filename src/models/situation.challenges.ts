import { Schema } from "mongoose";
import { options } from "./situation.base";
import SituationBase, { SituationBaseI } from "./situation.base";

export interface ChallengeI extends SituationBaseI {
  /**
   * GENERIC | PARTICULAR . Generic challenge is created for group ideas free.
   * Exist just one GENERIC CHALLENGE
   */
  type: string;
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
}

export const challengeModel = {
  type: String,
  defaultScope: Boolean,
  challengeId: String,
  isStrategic: Boolean,
  finalization: Date,
};

const Challenge = SituationBase.discriminator<ChallengeI>(
  "Challenge",
  new Schema(challengeModel, options)
);

export default Challenge;
