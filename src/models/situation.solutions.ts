import { Schema } from 'mongoose';
import SituationBase, {  SituationBaseI} from './situation.base';
import { ChallengeI } from './situation.challenges';

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
  }


const Solution = SituationBase.discriminator('Solution',new Schema({
    solutionId: String,
    challengeId: String,
    challenge: { 
      type: Schema.Types.ObjectId, 
      ref: 'Challenge' 
    },
}))

export default Solution;