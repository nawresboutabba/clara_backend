import * as express from "express";
import { BaremoI } from "../models/baremo";
import { ConfigurationDefaultI } from "../models/configuration.default";
import { GroupValidatorI } from "../models/group-validator";
import { CommentI } from "../models/interaction.comment";
import { SolutionInvitationI } from "../models/invitation";
import { AreaI } from "../models/organization.area";
import { ChallengeI } from "../models/situation.challenges";
import { SolutionI } from "../models/situation.solutions";
import { TagI } from "../models/tag";
import { UserI } from "../models/users";

export interface RequestMiddleware extends express.Request {
  /**
   * Session's user
   */
  user: UserI;
  resources?: {
    solution?: SolutionI;
    challenge?: ChallengeI;
  };
  utils?: {
    departmentAffected?: Array<AreaI>;
    groupValidator?: GroupValidatorI;
    areasAvailable?: Array<AreaI>;
    users: UserI[];
    /**
     * This user is different to req.user.
     * This user is a auxiliar field to add user to committee.
     * Is used for "to" invitaitons setting too. See as example in POST /solution/:solutionId/invitation
     */
    user: UserI;
    participation?: {
      creator: UserI;
      guests: UserI[];
    };
    defaultSolutionConfiguration?: ConfigurationDefaultI;
    /**
     * Is the same that parentComment, but a comment without childs
     */
    childComment?: CommentI;
    /**
     * When a comment is inserted, it can have a parent.
     * Just can exist 2 nivels of comments.
     */
    parentComment?: CommentI;
    /**
     * Tags what a resource is relationated
     */
    tags: TagI[];
    /**
     * individual tag added for comments
     */
    tagComment: TagI;
    /**
     * Is used when baremo intervention is created or updated.
     * "SPECIALIST_INTERVENTION" | "TEAM_VALIDATOR"
     */
    baremoType: string;
    /**
     * Baremo Entity
     */
    baremo: BaremoI;
    /**
     * Invitation
     */
    invitation: SolutionInvitationI;
    /**
     * Areas what a resource is relationated
     */
    areas: AreaI[];
  };
  timeZone?: string;
}

export type ResponseMiddleware = express.Response;
