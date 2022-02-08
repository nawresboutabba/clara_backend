import { Schema } from 'mongoose';
import { options } from './situation.base';
import SituationBase, {  SituationBaseI} from './situation.base';

export interface ChallengeI extends SituationBaseI  {
    /**
     * Id that uniquely identifies a challenge
     */
    challengeId:string,
    /**
     * Situation title
     */
    title: string,
    /**
     * If challenge response to strategic organization need.
     */
    isStrategic: boolean
    /**
     * Challenge finalization. Time limit for submit Ideas.
     */
    finalization: Date,
  }

const Challenge = SituationBase.discriminator('Challenge',new Schema({
    challengeId: String,
    isStrategic: Boolean,
    finalization: Date,
  }, options));

  export default Challenge