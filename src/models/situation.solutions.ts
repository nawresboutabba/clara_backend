import { Schema } from 'mongoose';
import { BaremoI } from './baremo';
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
    challengeId?: string
    /**
     *  Challenge Object. challengeId refer to challenge attribute. 
     * The redundace is for performance lookup (for example Solutions with a particular challengeId)
     */
    challenge?: ChallengeI,
    /**
     * Solution description
     */
    proposedSolution: string,
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
  }


const Solution = SituationBase.discriminator('Solution',new Schema({
  solutionId: String,
  challengeId: String,
  challenge: { 
    type: Schema.Types.ObjectId, 
    ref: 'Challenge' 
  },
  proposedSolution: String,
  startAnalysis: Date,
  initialEvaluator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  endAnalysis: Date,
}))

export default Solution;