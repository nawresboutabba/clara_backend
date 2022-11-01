import { z } from "zod";
import { INVITATION_STATUS } from "../../../models/invitation";
import { UserI } from "../../../models/users";
import InvitationService from "../../../services/Invitation.service";
import { validate } from "../../../utils/express/express-handler";
import { genericArrayChallengeInvitationFilter } from "../../../utils/field-filters/invitation";
import { removeEmpty } from "../../../utils/general/remove-empty";
import * as ChallengeRep from "../challenge.repository";

export const getChallengeInvites = validate(
  {
    params: z.object({ challengeId: z.string() }),
    query: z.object({ status: z.nativeEnum(INVITATION_STATUS) }).partial(),
  },
  async ({ user, params: { challengeId }, query: { status } }, res) => {
    const challenge = await ChallengeRep.getChallengeById(challengeId);
    if (
      challenge.author.userId !== user.userId &&
      challenge.coauthor.every((e: UserI) => e.userId !== user.userId)
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    const invitations = await InvitationService.getChallengeInvitations(
      removeEmpty({
        resource: challenge,
        status,
      })
    );

    return genericArrayChallengeInvitationFilter(invitations);
  }
);
