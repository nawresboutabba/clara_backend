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
     * Solution status @TODO do the solution status
     */
    status: string,
    /**
     * TimePeriod that challenge is in a Park for discussion
     */
    timeInPark: number,
    /**
     * Refers to baremos did it by validators @TODO convert to object
     */
    baremoValidator?: Array<String>,
    /**
     * Refer to baremo did it by referrer. @TODO convert to Object
     */
    baremoReferrer?: string,
    /**
     * Filename submited by generator
     */
    fileName: string
    /**
     * Calification summary (baremo average)
     */
    calification?: {
      complexity: number,
      impact: number,
    },
    /**
     * Reactions in park
     */
    reactions?: {
      likes: number,
      confused: number,
    },
  }


const Solution = SituationBase.discriminator('Solution',new Schema({
    solutionId: String,
    challengeId: String,
    canChooseScope: {
        type: Boolean,
        default: true,
      },
    isPrivate: {
        type: Boolean,
        default: true,
      },
    status: String,
    timeInPark: {
        type: Number,
        default: null,
      },
    fileName: String,
    baremoValidator: [
        {
          type: String,
        },
      ],
    baremoReferrer: String,
    calification: {
        complexity: Number,
        impact: Number,
      },
    reactions: {
        likes: Number,
        confused: Number,
      },
    challenge: { type: Schema.Types.ObjectId, ref: 'Challenge' }
}))

export default Solution;