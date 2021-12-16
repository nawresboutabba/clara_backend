import { Schema } from 'mongoose';
import { options } from './situation.base';
import SituationBase, {  SituationBaseI} from './situation.base';

export interface ChallengeI extends SituationBaseI  {
    /**
     * Id that uniquely identifies a challenge
     */
    challengeId:string,
    /**
     * If challenge response to strategic organization need.
     */
    isStrategic: boolean
    /**
     * TimePeriod that challenge is in a Park for discussion. Dimenention is in hours. 
     * Then a challenge will be in a park Challenge create + timePeriod
     */
    timePeriod: number,
  }

const Challenge = SituationBase.discriminator('Challenge',new Schema({
    challengeId: String,
    isStrategic: Boolean,
    timePeriod: Number,
  }, options));

  export default Challenge