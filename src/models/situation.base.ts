import { Schema, model } from 'mongoose';
import { GroupValidatorI } from './group-validator';
import { AreaI } from './organization.area';
import { UserI } from './users';
import { TeamI } from './team';
  

export const options = { 
  discriminatorKey: 'itemtype', 
  collection: 'situations' 
};

export interface SituationBaseI {
  _id?: any,
  /**
   * When the inserted user is not same that author user. 
   * Used for committe (Committe integrants has 
   * a Functionality for add generator's challenge)
   */
  insertedBy: UserI,
    /**
     * Generator that create the solution. 
     * This field exclusive with team configuration
     */  
  author?: UserI,
    /**
     * Team that propose the solution. Just available for challenges
     * with TEAMWORK active.
     * This field exclusive with author and coauthor configuration
     */
  team?: TeamI,
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
   * Areas available. Is used if WSALevel = AREA because a situation isn't available for all Company. Just for some areas.
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
  * Challenge | Problem | Solution Status: @TODO define situation challenge
  */
  status: string,
  /**
   * Complementary files to challenge, solution or problem
   */
  fileComplementary: string,
  /**
   * Reactions in park
   */
  reactions?: {
    likes: number,
    confused: number,
    comments: number
  },
}

const situationBase = new Schema({
    insertedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },  
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    team: {
      type: Schema.Types.ObjectId, 
      ref: 'Team' 
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
     status: String,
     fileComplementary: String,
     reactions: {
      likes: Number,
      confused: Number,
      comments: Number
    },
}, options)

export default model("SituationBase", situationBase);