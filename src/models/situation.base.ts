import { Schema, model } from 'mongoose';

export const options = { 
  discriminatorKey: 'itemtype', 
  collection: 'situations' 
};

export interface SituationBaseI {
  _id?: any,
    /**
     * Generator that create the solution
     */  
  author?: string,
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
}

const situationBase = new Schema({
    author: String,
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
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
}, options)

export default model("SituationBase", situationBase);