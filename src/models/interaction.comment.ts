import { Schema, Types } from "mongoose";
import { InteractionBase, InteractionBaseI, options } from "./interaction.base";
import { ChallengeI } from "../routes/challenges/challenge.model";
import { SolutionI } from "../routes/solutions/solution.model";
import { TagI } from "./tag";

export enum CommentScope {
  GROUP = "GROUP",
  PUBLIC = "PUBLIC",
}

export type CommentScopeType = keyof typeof CommentScope;

export interface GeneralCommentI extends InteractionBaseI {
  _id: Types.ObjectId;
  comment: string;
  version: string;
  tag: TagI;
  parent?: GeneralCommentI;
  scope: CommentScopeType;
}

const schema = {
  comment: String,
  version: String,
  tag: { type: Schema.Types.ObjectId, ref: "Tag" },
  parent: { type: Schema.Types.ObjectId, ref: "Comment" },
  scope: { type: String, enum: Object.values(CommentScope) },
};

export const GeneralComment = InteractionBase.discriminator<GeneralCommentI>(
  "Comment",
  new Schema<SolutionCommentI>(schema, options)
);

export interface SolutionCommentI extends GeneralCommentI {
  resource: SolutionI;
}

const solutionCommentSchema = new Schema<SolutionCommentI>(
  {
    ...schema,
    resource: { type: Types.ObjectId, ref: "Solution" },
    parent: { type: Schema.Types.ObjectId, ref: "SolutionComment" },
  },
  options
);

export const SolutionComment = InteractionBase.discriminator<SolutionCommentI>(
  "SolutionComment",
  solutionCommentSchema
);

export interface ChallengeCommentI extends GeneralCommentI {
  resource: ChallengeI;
}

const challengeCommentSchema = new Schema<ChallengeCommentI>(
  {
    ...schema,
    resource: { type: Types.ObjectId, ref: "Challenge" },
    parent: { type: Schema.Types.ObjectId, ref: "ChallengeComment" },
  },
  options
);

export const ChallengeComment =
  InteractionBase.discriminator<ChallengeCommentI>(
    "ChallengeComment",
    challengeCommentSchema
  );
