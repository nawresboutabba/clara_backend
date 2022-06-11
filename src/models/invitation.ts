import { model, Schema } from "mongoose";
import { SolutionI } from "./situation.solutions";
import { UserI } from "./users";

export interface InvitationI{
    /**
     * User that did the invitation
     */
    to: UserI,
    /**
     * Guest user
     */
    from: UserI,
    /**
     * Invitation creation Date
     */
    creationDate: Date,
    /**
     * accepted: true, rejected: false
     */
    invitationAccepted?: boolean,
    /**
     * Decision date
     */
    decisionDate?: Date,
    /**
     * Invitation type. see: const INVITATIONS
     */
    type: string,

}

export interface SolutionInvitationI extends InvitationI {
  solution: SolutionI
}

const invitation = new Schema({
  to:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  from:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  creationDate: Date,
  invitationAccepted: Boolean,
  decisionDate: Date,
  type: String,
  solution:{
    type: Schema.Types.ObjectId,
    ref: 'Solution'
  },
})

export default model('Invitation', invitation);