import { z } from "zod";
import { Invitation, INVITATION_STATUS } from "../../../models/invitation";
import { validate } from "../../../utils/express/express-handler";
import { genericArrayInvitationFilter } from "../../../utils/field-filters/invitation";
import { removeEmpty } from "../../../utils/general/remove-empty";

export const usersInvites = validate(
  {
    query: z.object({
      status: z.array(z.nativeEnum(INVITATION_STATUS)).optional(),
    }),
  },
  async ({ user, query: { status } }) => {
    const invites = await Invitation.find(
      removeEmpty({
        to: user,
        status: { $in: status },
      })
    )
      .populate({
        path: "resource",
        populate: { path: "challenge" },
      })
      .populate("from")
      .populate("to");

    return genericArrayInvitationFilter(invites);
  }
);
