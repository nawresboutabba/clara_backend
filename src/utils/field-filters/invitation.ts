import { SolutionInvitationI } from "../../models/invitation";
import { lightSolutionFilter } from "./solution";
import { lightUserFilter } from "./user";

export const genericSolutionInvitationFilter = async (
  invitation: SolutionInvitationI
): Promise<any> => {
  const {
    creationDate,
    decisionDate,
    invitationAccepted,
    type,
    invitationId,
    resource,
    status,
  } = invitation;
  const to = await lightUserFilter(invitation.to);
  const from = await lightUserFilter(invitation.from);
  const solution = await lightSolutionFilter(invitation.solution);
  return {
    resource,
    invitation_id: invitationId,
    creation_date: creationDate,
    decision_date: decisionDate,
    invitation_accepted: invitationAccepted,
    type,
    to,
    from,
    solution,
    status,
  };
};

export const genericArraySolutionInvitationFilter = async (
  invitations: SolutionInvitationI[]
): Promise<any> => {
  return Promise.all(invitations.map(genericSolutionInvitationFilter));
};
