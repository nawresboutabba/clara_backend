import { model, Schema, Types } from "mongoose";
import { ChallengeI } from "./situation.challenges";
import { SolutionI } from "./situation.solutions";
import { UserI } from "./users";

export enum INVITATION_STATUS {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export type INVITATION_STATUS_TYPE = keyof typeof INVITATION_STATUS;

export enum INVITATION_TYPE {
  TEAM_PARTICIPATION = "TEAM_PARTICIPATION",
  EXTERNAL_OPINION = "EXTERNAL_OPINION",
  COAUTHORSHIP_PARTICIPATION = "COAUTHORSHIP_PARTICIPATION",
}

export type INVITATION_TYPE_TYPE = keyof typeof INVITATION_TYPE;

export interface InvitationI {
  _id: Types.ObjectId;
  /**
   * Guest user
   */
  to: UserI;
  /**
   * User that did the invitation
   */
  from: UserI;
  /**
   * Date when status change from idle to another value
   */
  decisionDate?: Date;
  /**
   * Resource for which an invitation is granted
   */
  resource: SolutionI | ChallengeI;
  /**
   * Invitation type: "TEAM_PARTICIPATION" | "EXTERNAL_OPINION" | "COAUTHORSHIP_PARTICIPATION"
   */
  type: INVITATION_TYPE_TYPE;
  /**
   * Status: "PENDING" | "CANCELED" | "ACCEPTED" | "REJECTED"
   */
  status: INVITATION_STATUS_TYPE;
  createdAt: Date;
  updatedAt: Date;
}

export interface SolutionInvitationI extends InvitationI {
  resource: SolutionI;
}

const invitationSchema = new Schema<InvitationI>(
  {
    to: { type: Types.ObjectId, ref: "User" },
    from: { type: Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: Object.values(INVITATION_STATUS),
      default: INVITATION_STATUS.PENDING,
    },
    decisionDate: Date,
    resource: Types.ObjectId,
    type: String,
  },
  { timestamps: true }
);

const Invitation = model<InvitationI>("Invitation", invitationSchema);

export const SolutionInvitation = Invitation.discriminator<SolutionInvitationI>(
  "SolutionInvitation",
  new Schema({
    resource: { type: Types.ObjectId, ref: "Solution" },
  })
);
