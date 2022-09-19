import { z } from "zod";
import {
  INVITATION_STATUS, SolutionInvitation
} from "../../../models/invitation";
import { validate } from "../../../utils/express/express-handler";
import {
  genericSolutionInvitationFilter
} from "../../../utils/field-filters/invitation";
import { getCurrentDate } from "../../../utils/general/date";


export const cancelSolutionInvite = validate(
  {
    params: z.object({ invitationId: z.string() }),
  },
  async ({ user, params: { invitationId } }, res) => {
    const invite = await SolutionInvitation.findById(invitationId)
      .populate({
        path: "resource",
        populate: { path: "challenge" },
      })
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
    return genericSolutionInvitationFilter(await invite.save());
  }
);
