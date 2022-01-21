import { Schema, model } from "mongoose";

export const options = { 
    discriminatorKey: 'itemtype', 
    collection: 'configuration' 
  };

export interface ConfigurationBaseI {
    configurationId: string,
    updated: Date,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
    canChooseScope: boolean,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     * this option is used in combination with `canChooseScope`.
     */
    isPrivate: boolean,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
    filterReactionFilter: boolean,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
    filterMinimunLikes: number,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
    filterMaximunDontUnderstand: number,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
     communityCanSeeReactions: boolean,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
     filterCanShowDisagreement: boolean,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
     filterCanFixDesapprovedIdea: boolean,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
     timeInPark: number,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
     timeExpertFeedback: number,
    /**
     * Configuration used when a solution is generated. 
     * It can be with an associated challenge or not.
     */
     timeIdeaFix: number     

}
const configurationBase = new Schema ({
    configurationId: String,
    updated: Date,
    canChooseScope: Boolean,
    isPrivate: Boolean,
    filterReactionFilter: Boolean,
    filterMinimunLikes: Number,
    filterMaximunDontUnderstand: Number,
    communityCanSeeReactions: Boolean,
    filterCanShowDisagreement: Boolean,
    filterCanFixDesapprovedIdea: Boolean,
    timeInPark: Number,
    timeExpertFeedback: Number,
    timeIdeaFix: Number
}, options);

export default model('Configuration', configurationBase);