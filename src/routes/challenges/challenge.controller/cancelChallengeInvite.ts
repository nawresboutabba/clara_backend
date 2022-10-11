import { z } from "zod";
import { ChallengeInvitation, INVITATION_STATUS } from "../../../models/invitation";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeInvitationFilter } from "../../../utils/field-filters/invitation";
import { getCurrentDate } from "../../../utils/general/date";

export const cancelChallengeInvite = validate(
  {
    params: z.object({ invitationId: z.string() }),
  },
  async ({ user, params: { invitationId } }, res) => {
    const invite = await ChallengeInvitation.findById(invitationId)
      .populate("resource")
      .populate("from")
      .populate("to");

    if (invite.from.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" });
    }
    if (invite.status !== INVITATION_STATUS.PENDING) {
      return res
        .status(403)
        .json({ message: "The invitation has already been answered" });
    }

    invite.decisionDate = getCurrentDate();
    invite.status = INVITATION_STATUS.CANCELED;
    return genericChallengeInvitationFilter(await invite.save());
  }
);
