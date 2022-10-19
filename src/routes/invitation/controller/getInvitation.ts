import { z } from "zod";
import { Invitation } from "../../../models/invitation";
import { validate } from "../../../utils/express/express-handler";
import { genericInvitationFilter } from "../../../utils/field-filters/invitation";

export const getInvitation = validate(
  {
    params: z.object({
      invitationId: z.string(),
    }),
  },
  async ({ user, params: { invitationId } }, res) => {
    const invite = await Invitation.findById(invitationId)
      .populate({
        path: "resource",
        populate: { path: "challenge" },
      })
      .populate("from")
      .populate("to");

    if (
      invite.from.userId !== user.userId &&
      invite.to.userId !== user.userId
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    return genericInvitationFilter(invite);
  }
);
