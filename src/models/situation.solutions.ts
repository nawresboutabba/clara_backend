import { Schema } from 'mongoose';
import SituationBase, {  SituationBaseI} from './situation.base';
import { ChallengeI } from './situation.challenges';

export interface SolutionI extends SituationBaseI {
    /**
     * Id that uniquely identifies a solution
     */
    solutionId: string,
    /**
     * Id that identify the challenge associated. If undefinedn then solution
     * was an initiative of a generator
     */
    challengeId?: string,
    /**
     *  Challenge Object. challengeId refer to challenge attribute. 
     * The redundace is for performance lookup (for example Solutions with a particular challengeId)
     */
    challenge?: ChallengeI,
    /**
     * If true, solution's generator can choose if the 
     * solution is shared with the community
     */
    canChooseScope:boolean,
    /**
     * Solution is shared with the community?
     */
    isPrivate:boolean,
    /**
     * TimePeriod that challenge is in a Park for discussion
     */
    timeInPark: number,
  }


const Solution = SituationBase.discriminator('Solution',new Schema({
    solutionId: String,
    challengeId: String,
    challenge: { 
      type: Schema.Types.ObjectId, 
      ref: 'Challenge' 
    },
    canChooseScope: {
        type: Boolean,
        default: true,
      },
    isPrivate: {
        type: Boolean,
        default: true,
      },
    timeInPark: {
        type: Number,
        default: null,
      },

}))

export default Solution;