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
     * Solution is shared with the community in the Park
     */
    isPrivate:boolean,
    /**
     * Single value. Election between availables in Challenge.participationMode 
     */
    participationModeChosen: string
    /**
     * variable that indicates if 
     * the automatic filtering options are enabled in the Park
     */
    filterReactionFilter: boolean,
    /**
     * Valid if filterReactionFilter == true
     */
    filterMinimunLikes: number,
    /**
     * Valid if filterReactionFilter == true
     */
    filterMaximunDontUnderstand: number,
    /**
     * The visualization of the occurred reactions can be disabled
     */
    communityCanSeeReactions: boolean,
    /**
     * If an idea is rejected, those responsible for 
     * the idea can show disagreement with the result
     */
    filterCanShowDisagreement: boolean,
    /**
     * The user can make corrections to his idea when it is rejected.
     */
    filterCanFixDesapprovedIdea: boolean,
    /**
     * TimePeriod that challenge is in a Park for discussion
     * Is used if isPrivate == false
     */
    timeInPark: number,
    /**
     * Time limit that the expert has to give his evaluation
     */
    timeExpertFeedback: number,
    /**
     * Time limit for those responsible for the idea to 
     * make a new delivery of the corrected solution.
     * Is used if filterCanFixDesapprovedIdea == true
     */
    timeIdeaFix: number
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
    participationModeChosen: String,
    filterReactionFilter: Boolean,
    filterMinimunLikes: Number,
    filterMaximunDontUnderstand: Number,
    communityCanSeeReactions: Boolean,
    filterCanShowDisagreement: Boolean,
    filterCanFixDesapprovedIdea: Boolean,
    timeInPark: Number,
    timeExpertFeedback: Number,
    timeIdeaFix: Number
}))

export default Solution;