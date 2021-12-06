import { Schema } from 'mongoose';
import { options } from './situation.base';
import SituationBase, {  SituationBaseI} from './situation.base';

export interface ChallengeI extends SituationBaseI  {
    /**
     * Id that uniquely identifies a challenge
     */
    challengeId:string,
    /**
     * Area that challenge is relationated @TODO add departments as CONSTANTS
     */
    department: string,
    /**
     * If challenge response to strategic organization need.
     */
    isStrategic: boolean
    /**
     * TimePeriod that challenge is in a Park for discussion. Dimenention is in hours. 
     * Then a challenge will be in a park Challenge create + timePeriod
     */
    timePeriod: number,
    /**
     * Challenge Status: @TODO define status challenge
     */
    status: string,
    /**
     * Committe Users who have the responsibility of managing the destination of the challenge 
     */
    validators: Array<String>,
    /**
     * Users who have the responsibility of managing an organization department.
     * Could be committe member or not.  Referrer work with validators because generally a challenge impact
     * is relationated with a organization area.
     */
    referrer: String,
    /**
     * Workspace is a concept that allows to manage resources access for users.
     * If a user and resources are in a same work space, then could be returned
     */
    workSpaceAvailable: Array<String>
  }

const Challenge = SituationBase.discriminator('Challenge',new Schema({
    challengeId: String,
    created: {
      type: Date,
      default: Date.now,
    },
    timePeriod: Number,
    status: String,
    validators: [
      {
        type: String,
      },
    ],
    referrer: String,
    workSpaceAvailable: [
      {
        type: String,
      },
    ],
  }, options));

  export default Challenge