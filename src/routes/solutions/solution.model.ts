import { Schema } from "mongoose";
import SituationBase, { SituationBaseI } from "../../models/situation.base";
import { ChallengeI } from "../challenges/challenge.model";
import { UserI } from "../../models/users";
import { StrategicAlignmentI } from "../strategic-alignment/strategic-alignment.model";

export const SOLUTION_STATUS = {
  DRAFT: "DRAFT",
  PROPOSED: "PROPOSED",
  APPROVED_FOR_DISCUSSION: "APPROVED_FOR_DISCUSSION",
  READY_FOR_ANALYSIS: "READY_FOR_ANALYSIS",
  ANALYZING: "ANALYZING",
  REVIEW: "REVIEW",
  APPROVED_FOR_CONSTRUCTION: "APPROVED_FOR_CONSTRUCTION",
  REJECTED: "REJECTED",
};
export type SOLUTION_STATUS = keyof typeof SOLUTION_STATUS;

export interface SolutionI extends SituationBaseI {
  /**
   * Id that uniquely identifies a solution
   */
  solutionId: string;
  /**
   * Id Challenge associated to solution.
   */
  challengeId: string;
  /**
   *  Challenge Object. challengeId refer to challenge attribute.
   * The redundace is for performance lookup (for example Solutions with a particular challengeId)
   */
  challenge: ChallengeI;
  /**
   * Solution description
   */
  proposedSolution: string;
  /**
   * What's new about your idea?
   */
  differential: string;
  /**
   * Is new for COMPANY, WORLD, MARKET
   */
  isNewFor: string;
  /**
   * @TODO add baremaTypeReco
   */
  baremaTypeSuggested: string;
  /**
   * The idea was tested
   */
  wasTested: boolean;
  /**
   * @TODO how was tested
   */
  testDescription: string;
  /**
   * First Difficulty
   */
  firstDifficulty: string;
  /**
   * Second Difficulty
   */
  secondDifficulty: string;
  /**
   * Third Difficulty
   */
  thirdDifficulty: string;
  /**
   * Implementation Time in Months
   */
  implementationTimeInMonths: number;
  /**
   *
   */
  impact: string;
  /**
   * How much money does the project need for its execution?
   */
  moneyNeeded: number;
  /**
   * Data that idea was opened for analysis
   */
  startAnalysis?: Date;
  /**
   * Evaluator that opened the idea for analysis. Is part of Team Validator
   */
  initialEvaluator?: UserI;
  /**
   * End of analysis
   */
  endAnalysis?: Date;
  /**
   * idea version
   */
  version: number;
  /**
   * Configuration parameters section
   */
  /**
   * if committee allow to user choose solution privacity
   */
  isPrivated: boolean;

  status: SOLUTION_STATUS;
  strategic_alignment: StrategicAlignmentI;
}

const Solution = SituationBase.discriminator<SolutionI>(
  "Solution",
  new Schema({
    solutionId: String,
    challengeId: String,
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
    },
    proposedSolution: String,
    differential: String,
    isNewFor: String,
    wasTested: Boolean,
    testDescription: String,
    baremaTypeSuggested: String,
    firstDifficulty: String,
    secondDifficulty: String,
    thirdDifficulty: String,
    implementationTimeInMonths: Number,
    moneyNeeded: Number,
    impact: String,
    startAnalysis: Date,
    initialEvaluator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    endAnalysis: Date,
    version: Number,
    isPrivated: Boolean,
    type: String,
    strategic_alignment: {
      type: Schema.Types.ObjectId,
      ref: "StrategicAlignment",
    },
  })
);

export default Solution;
