import { model, Schema } from "mongoose";
import { SolutionI } from "./situation.solutions";
import { UserI } from "./users";

export interface InvitationI{
  /**
   * InvitationId
   */
    invitationId: string
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
     * Resource for which an invitation is granted. e.g.: SOLUTION
     */
    resource: string
    /**
     * Invitation type. see: const INVITATIONS
     */
    type: string,
    /**
     * Status is calculated
     */
}

export interface SolutionInvitationI extends InvitationI {
  solution: SolutionI
}

const invitation = new Schema({
  invitationId: String,
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
  resource: String, 
  type: String,
  solution:{
    type: Schema.Types.ObjectId,
    ref: 'Solution'
  },
})

export default model('Invitation', invitation);