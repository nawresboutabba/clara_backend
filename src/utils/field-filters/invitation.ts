import {
  ChallengeInvitationI,
  SolutionInvitationI,
} from "../../models/invitation";
import { lightSolutionFilter } from "./solution";
import { lightUserFilter } from "./user";
import { lightChallengeFilter } from "./challenge";

// interface  {
//   id: Types.ObjectId;
//   resource: LightSolutionResponse;
//   createdAt: Date;
//   updatedAt: Date;
//   decisionDate: Date;
//   status: INVITATION_STATUS_TYPE;
//   type: INVITATION_TYPE_TYPE;
//   to: any;
//   from: any;
// }

export async function genericSolutionInvitationFilter(
  invitation: SolutionInvitationI
) {
  const to = await lightUserFilter(invitation.to);
  const from = await lightUserFilter(invitation.from);
  const solution = await lightSolutionFilter(invitation.resource);

  return {
    id: invitation._id,
    resource: solution,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
    decisionDate: invitation.decisionDate,
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

export async function genericChallengeInvitationFilter(
  invitation: ChallengeInvitationI
) {
  const to = await lightUserFilter(invitation.to);
  const from = await lightUserFilter(invitation.from);
  const challenge = await lightChallengeFilter(invitation.resource);

  return {
    id: invitation._id,
    resource: challenge,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
    decisionDate: invitation.decisionDate,
    status: invitation.status,
    type: invitation.type,
    to,
    from,
  };
}

export async function genericArrayChallengeInvitationFilter(
  invitations: ChallengeInvitationI[]
) {
  return Promise.all(invitations.map(genericChallengeInvitationFilter));
}
