import { Schema, model } from "mongoose";
import { GroupValidatorI } from "./group-validator";
import { AreaI } from "../routes/area/area.model";
import { UserI } from "../routes/users/users.model";
import { TeamI } from "./team";
import Log from "./log";
import historicalSolutions from "./historical-solutions";
import * as _ from "lodash";
import { TagI } from "./tag";

export const options = {
  discriminatorKey: "itemtype",
  collection: "situations",
  timestamps: true,
};

export interface SituationBaseI {
  id?: string;
  _id?: any;
  /**
   * When the inserted user is not same that author user.
   * Used for committe (Committe integrants has
   * a Functionality for add generator's challenge)
   */
  insertedBy: UserI;
  /**
   * User that did the last change
   */
  updatedBy: UserI;
  /**
   * Generator that create the solution.
   * This field exclusive with team configuration
   */
  author?: UserI;
  /**
   * field that is combined with author
   * when participationModeChosen = "INDIVIDUAL_WITH_COAUTHORSHIP"
   */
  coauthor?: Array<UserI>;
  /**
   *  When a user external to the idea is invited to give their opinion
   */
  externalOpinion?: Array<UserI>;
  /**
   * Field that is filled when participationModeChosen = "TEAM"
   * This field exclusive with author and coauthor configuration
   */
  team?: TeamI;
  /**
   * Solution creation date
   */
  created: Date;
  /**
   * Solution update date
   */
  updated?: Date;
  /**
   * Situation title.
   * If a challenge's solution, title is not required.
   */
  title: string;
  /**
   * Situation description. Could be a challenge or description of an identified problem.
   */
  description: string;
  /**
   * Flag that indicate if a resource is active.
   */
  active: boolean;
  deletedAt?: Date;
  /**
   * Banner image
   */
  bannerImage: string;
  /**
   * Solution images
   */
  images: Array<string>;
  /**
   * Departments Affected
   */
  departmentAffected?: Array<AreaI>;
  /**
   * Group that do the analysis about the situation
   */
  groupValidator?: GroupValidatorI;
  /**
   * Challenge | Problem | Solution Status: @TODO define situation challenge
   */
  status: string;
  /**
   * Complementary files to challenge, solution or problem
   */
  fileComplementary: Array<string>;
  /**
   * Tags relationated
   */
  tags: TagI[];
  /**
   * ---------------------------------
   * Configuration Section
   * ---------------------------------
   */

  /**
   * Can the generator choose the privacy of the solution
   * (if it goes to the park or directly to the committee)?
   * Affects the scope_chosed attribute.
   * If can_chosose_scope = true, then the maintainer
   * can edit is_privated (otherwise, the default value goes)
   */
  canChooseScope: boolean;
  /**
   * Determines if the user can edit the WSALevel_chosed. W
   * Work with WSALevelAvailable and WSALevelChosed.
   */
  canChooseWSALevel: boolean;
  /**
   * WorkSpaceAvailable.
   * If the situation is available for all company or just for some areas.
   * @TODO convert description to constants
   * Work with canChooseWSALevel and WSALevelChosed.
   *
   */
  WSALevelAvailable: string[];
  /**
   * Space for which the resource is available.
   * It can be One.
   * It is chosen by the person in charge of the situation
   */
  WSALevelChosed: string;
  /**
   * When WSALevel = COMPANY this attribute is not required.
   * Areas available. Is used if WSALevel = AREA because a situation isn't available for all Company. Just for some areas.
   */
  areasAvailable?: Array<AreaI>;
  /**
   * Reactions in park
   */
  communityCanSeeReactions: boolean;
  /**
   * How can you participate in the proposal of a solution?
   * - INDIVIDUAL_WITH_COAUTHORSHIP - TEAM
   */
  participationModeAvailable: string[];
  /**
   * How does the person in charge participate?
   * Works in combination with
   * participation_mode_available
   */
  participationModeChosed: string;
  /**
   * Deprecated. Because the ideas are exposed and withdrawn at will.
   */
  timeInPark: number;
  timeExpertFeedback: number;
  /**
   * Deprecated. Because the ideas are not rejected. Just exist a infity corrections cycle.
   */
  timeIdeaFix: number;

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
  externalContributionAvailableForGenerators: boolean;
  /**
   * Are invitations to external contributors
   * by the committee allowed? affects whether authors,
   * co-authors, and teams can be made up of externals.
   * If the scope is at the COMPANY level,
   * and this option is equal to true,
   * then the author or creator of the team can invite
   * people from outside the organization.
   */
  externalContributionAvailableForCommittee: boolean;
  /**
   * Calculated field
   */
  interactions?: {
    interaction: string;
    count: number;
  };
}

export const situationBaseModel = {
  insertedBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  coauthor: [{ type: Schema.Types.ObjectId, ref: "User" }],
  externalOpinion: [{ type: Schema.Types.ObjectId, ref: "User" }],
  team: { type: Schema.Types.ObjectId, ref: "Team" },
  created: { type: Date, default: Date.now },
  updated: Date,
  title: { type: String, required: false },
  description: String,
  active: { type: Boolean, default: true },
  bannerImage: String,
  images: [{ type: String }],
  departmentAffected: [{ type: Schema.Types.ObjectId, ref: "Area" }],
  groupValidator: { type: Schema.Types.ObjectId, ref: "GroupValidator" },
  status: String,
  fileComplementary: [{ type: String }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  /**
   * ---------------------------------
   * Configuration Section
   * ---------------------------------
   */
  canChooseScope: Boolean,
  canChooseWSALevel: Boolean,
  WSALevelAvailable: [String],
  WSALevelChosed: String,
  areasAvailable: [
    {
      type: Schema.Types.ObjectId,
      ref: "Area",
    },
  ],
  communityCanSeeReactions: Boolean,
  participationModeAvailable: [String],
  participationModeChosed: String,
  timeInPark: Number,
  timeExpertFeedback: Number,
  timeIdeaFix: Number,
  externalContributionAvailableForGenerators: Boolean,
  externalContributionAvailableForCommittee: Boolean,
};

const situationBase = new Schema(
  {
    ...situationBaseModel,
  },
  options
);

situationBase.post("findOneAndUpdate", async (document) => {
  try {
    const solution = _.omit(document.toJSON(), ["_id", "__v"]);
    solution.updated = new Date();
    await historicalSolutions.create(solution);
  } catch (error) {
    console.log(
      `Error with log integrants changes. Document:${document} . Error: ${error}`
    );
  }
});

const SituationModel = model("SituationBase", situationBase);

SituationModel.watch()
  /**
   * @TODO add document audit
   */
  .on("change", (data) => {
    try {
      const log = _.omit(data, ["_id", "__v"]);
      Log.create(log);
    } catch (error) {
      console.log(`Error with log event ${data}. Error: ${error}`);
    }
  });

export default SituationModel;
