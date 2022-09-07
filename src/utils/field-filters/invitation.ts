import { LightSolutionResponse } from "../../controller/solutions";
import {
  INVITATION_STATUS_TYPE,
  INVITATION_TYPE_TYPE,
  SolutionInvitationI,
} from "../../models/invitation";
import { lightSolutionFilter } from "./solution";
import { lightUserFilter } from "./user";
import { Types } from "mongoose";

interface SolutionInvitationResponse {
  id: Types.ObjectId;
  resource: LightSolutionResponse;
  createdAt: Date;
  updatedAt: Date;
  decision_date: Date;
  status: INVITATION_STATUS_TYPE;
  type: INVITATION_TYPE_TYPE;
  to: any;
  from: any;
}

export async function genericSolutionInvitationFilter(
  invitation: SolutionInvitationI
): Promise<SolutionInvitationResponse> {
  const to = await lightUserFilter(invitation.to);
  const from = await lightUserFilter(invitation.from);
  const solution = await lightSolutionFilter(invitation.resource);

  return {
    id: invitation._id,
    resource: solution,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
    decision_date: invitation.decisionDate,
    status: invitation.status,
    type: invitation.type,
    to,
    from,
  };
}

export async function genericArraySolutionInvitationFilter(
  invitations: SolutionInvitationI[]
) {
  return Promise.all(invitations.map(genericSolutionInvitationFilter));
}
