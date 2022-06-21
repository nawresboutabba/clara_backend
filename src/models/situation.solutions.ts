import { Schema } from 'mongoose';
import SituationBase, {  SituationBaseI} from './situation.base';
import { ChallengeI } from './situation.challenges';
import { UserI } from './users';

export interface SolutionI extends SituationBaseI {
    /**
     * Id that uniquely identifies a solution
     */
    solutionId: string,
    /**
     * Id Challenge associated to solution.
     */
    challengeId: string
    /**
     *  Challenge Object. challengeId refer to challenge attribute. 
     * The redundace is for performance lookup (for example Solutions with a particular challengeId)
     */
    challenge: ChallengeI,
    /**
     * Solution description
     */
    proposedSolution: string,
    /**
     * What's new about your idea?
     */
    differential:string, 
    /**
     * Is new for COMPANY, WORLD, MARKET
     */
    isNewFor: string, 
    /**
     * The idea was tested
     */
    wasTested: boolean,
    /**
     * First Difficulty
     */
    firstDifficulty: string, 
    /**
     * Second Difficulty
     */
    secondDifficulty: string, 
    /**
     * Third Difficulty
     */
    thirdDifficulty: string,
    /**
     * Implementation Time in Months
     */
    implementationTimeInMonths: number,
    /**
     * How much money does the project need for its execution?
     */
    moneyNeeded: number, 
    /**
     * Data that idea was opened for analysis
     */
    startAnalysis?: Date,
    /**
     * Evaluator that opened the idea for analysis. Is part of Team Validator
     */
    initialEvaluator?: UserI,
    /**
     * End of analysis
     */
    endAnalysis?: Date,
    /**
     * idea version
     */
    version: number,
    /**
     * Configuration parameters section
     */
    /**
     * if committee allow to user choose solution privacity
     */
    isPrivated: boolean,
  }


const Solution = SituationBase.discriminator('Solution',new Schema({
  solutionId: String,
  challengeId: String,
  challenge: { 
    type: Schema.Types.ObjectId, 
    ref: 'Challenge' 
  },
  proposedSolution: String,
  differential:String,
  isNewFor: String, 
  wasTested: Boolean,
  firstDifficulty: String, 
  secondDifficulty:String, 
  thirdDifficulty: String,
  implementationTimeinMonths: Number,
  moneyNeeded: Number,
  startAnalysis: Date,
  initialEvaluator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  endAnalysis: Date,
  version: Number,
  isPrivated: Boolean
}))


export default Solution;