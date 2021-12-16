import { Schema, model } from 'mongoose';
import { GroupValidatorI } from './group-validator';
import { AreaI } from './organization.area';
import { UserI } from './users';
import { ValidatorI } from './validator';

export const options = { 
  discriminatorKey: 'itemtype', 
  collection: 'situations' 
};

export interface SituationBaseI {
  _id?: any,
    /**
     * Generator that create the solution
     */  
  author: UserI,
      /**
     * Solution creation date
     */
  created: Date,
    /**
     * Solution update date
     */
  updated?: Date,
  /**
   * Situation title
   */
  title: string,
    /**
     * Solution description
     */
  description: string,
    /**
     * Flag that indicate if a solution is active.
     * When a challenge is delete, the flag is false
     */
  active: boolean,
    /**
     * Solution images
     */
  images: Array<string>,
  /**
   * WorkSpaceAvailable.
   * If the situation is available for all company or just for some areas. 
   * @TODO convert description to constants
   */
  WSALevel: "COMPANY" | "AREA",
  /**
   * Areas available. Is user if WSALevel = AREA because a situation isn't available for all Company. Just for some areas.
   */
  areasAvailable?: Array<AreaI>,
  /**
   * Departments Affected
   */
  departmentAffected?: Array<AreaI>
  /**
   * Group that do the analysis about the situation
   */
  groupValidator?: GroupValidatorI,
  /**
   * validators that compose the group. 
   * The redundance exist because a group validator can change in the 
   * future, then is better save the validators that do a baremo for this challenge. 
   */
  validators?: Array<ValidatorI>,
  /**
  * Challenge | Problem | Solution Status: @TODO define situation challenge
  */
  status: string,
  /**
   * Complementary files to challenge, solution or problem
   */
  fileComplementary: string
}

const situationBase = new Schema({
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
    title: {
      type: String,
      required: true
    },
    description: String,
    active: {
        type: Boolean,
        default: true,
      },
    images: [
        {
          type: String,
        },
      ],
    WSALevel: {
      type: String,
      required: true
    },
    areasAvailable:  [{ 
      type: Schema.Types.ObjectId,
      ref: 'Area'
     }],
     departmentAffected: [{
       type: Schema.Types.ObjectId,
       ref: 'Area'
     }],
     groupValidator: {
       type: Schema.Types.ObjectId,
       ref: 'GroupValidator'
     },
     validators: {
       type: Schema.Types.ObjectId,
       ref: 'Validator'
     },
     status: String,
     fileComplementary: String
}, options)

export default model("SituationBase", situationBase);