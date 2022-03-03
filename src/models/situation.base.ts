import { Schema, model } from 'mongoose';
import { GroupValidatorI } from './group-validator';
import { AreaI } from './organization.area';
import { UserI } from './users';
import { TeamI } from './team';
import Log from './log';
import historicalSolutions from './historical-solutions';
import * as _ from 'lodash';

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
   * User that did the last change
   */
  updatedBy: UserI,
  /**
   * Generator that create the solution. 
   * This field exclusive with team configuration
   */
  author?: UserI,
  /**
   * field that is combined with author 
   * when participationModeChosen = "INDIVIDUAL_WITH_COAUTHORSHIP"
   */
  coauthor?: Array<UserI>,
  /**
   * Field that is filled when participationModeChosen = "TEAM"
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
   * Situation title. 
   * If a challenge's solution, title is not required.
   */
  title: string,
  /**
   * Situation description. Could be a challenge or description of an identified problem.
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
   * Departments Affected
   */
  departmentAffected?: Array<AreaI>,
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
   * ---------------------------------
   * Configuration Section
   * ---------------------------------
   */
  /**
   * Can those responsible express their disagreement? 
   * It affects an attribute in the Barema that indicates 
   * if the person responsible for the solution agrees or 
   * disagrees with the rating.
   */
  canShowDisagreement: boolean,
  /**
   * Can managers make corrections after disapproving an idea? 
   * Affects the ability to update the solution for a solution 
   * status = REJECTED
   */
  canFixDisapprovedIdea: boolean,
  /**
   * Can the generator choose the privacy of the solution 
   * (if it goes to the park or directly to the committee)?
   * Affects the scope_chosed attribute.
   * If can_chosose_scope = true, then the maintainer 
   * can edit is_privated (otherwise, the default value goes)
   */
  canChooseScope: boolean,
  /**
   * if committee allow to user choose solution privacity
   */
  isPrivated: boolean,
  /**
   * Determines if the user can edit the WSALevel_chosed.
   */
  canChooseWSALevel: boolean,
  /**
   * WorkSpaceAvailable.
   * If the situation is available for all company or just for some areas. 
   * @TODO convert description to constants
   */
  WSALevelAvailable: string[]
  /**
   * Space for which the resource is available. 
   * It can be One. 
   * It is chosen by the person in charge of the situation
   */
  WSALevelChosed: string,
  /**
   * Areas available. Is used if WSALevel = AREA because a situation isn't available for all Company. Just for some areas.
   */
  areasAvailable?: Array<AreaI>,
  /**
   * Reactions in park
   */
  communityCanSeeReactions: boolean,
  minimumLikes: number,
  maximumDontUnderstand: number,
  reactionFilter: boolean
  /**
   * How can you participate in the proposal of a solution?
   * - INDIVIDUAL_WITH_COAUTHORSHIP - TEAM
   */
  participationModeAvailable: string[],
  /**
   * How does the person in charge participate? 
   * Works in combination with 
   * participation_mode_available
   */
  participationModeChosed: string

  timeInPark: number,
  timeExpertFeedback: number,
  timeIdeaFix: number,

  /**
   * Are invitations to external contributors 
   * by generators allowed? 
   * affects whether authors, co-authors, 
   * and teams can be made up of externals. 
   * If the scope is at the COMPANY level, 
   * and this option is equal to true, 
   * then the author or creator of the team can 
   * invite people from outside the organization.
   */
  externalContributionAvailableForGenerators: boolean,
  /**
   * Are invitations to external contributors 
   * by the committee allowed? affects whether authors, 
   * co-authors, and teams can be made up of externals. 
   * If the scope is at the COMPANY level, 
   * and this option is equal to true, 
   * then the author or creator of the team can invite 
   * people from outside the organization.
   */
  externalContributionAvailableForCommittee: boolean,
  /**
   * Calculated field
   */
  interactions?: {
    interaction: string,
    count: number
  }
}

export const situationBaseModel = {
  insertedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  coauthor: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
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
    required: false
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
  /**
   * ---------------------------------
   * Configuration Section
   * ---------------------------------
   */
  canShowDisagreement: Boolean,
  canFixDisapprovedIdea: Boolean,
  canChooseScope: Boolean,
  isPrivated: Boolean,
  canChooseWSALevel: Boolean,
  WSALevelAvailable: [String],
  WSALevelChosed: String,
  areasAvailable: [{
    type: Schema.Types.ObjectId,
    ref: 'Area'
  }],
  communityCanSeeReactions: Boolean,
  minimumLikes: Number,
  maximumDontUnderstand: Number,
  reactionFilter: Boolean,
  participationModeAvailable: [String],
  participationModeChosed: String,
  timeInPark: Number,
  timeExpertFeedback: Number,
  timeIdeaFix: Number,
  externalContributionAvailableForGenerators: Boolean,
  externalContributionAvailableForCommittee: Boolean,
}

const situationBase = new Schema({
  ...situationBaseModel
}, options)


situationBase.post('findOneAndUpdate', async (document) => {
  try {
    const solution = _.omit(document.toJSON(), ['_id', '__v'])
    solution.updated = new Date()
    await historicalSolutions.create(solution)
  } catch (error) {
    console.log(`Error with log integrants changes. Document:${document} . Error: ${error}`)
  }
})

const SituationModel = model('SituationBase', situationBase);


SituationModel.watch().
/**
   * @TODO add document audit
   */
  on('change', data => {
    try {
      const log = _.omit(data, ['_id', '__v'])
      Log.create(log)
    } catch (error) {
      console.log(`Error with log event ${data}. Error: ${error}`)
    }
  });


export default SituationModel;