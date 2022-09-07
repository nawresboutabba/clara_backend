import { z } from "zod";
import { INVITATION_STATUS, SolutionInvitation } from "../../models/invitation";
import { validate } from "../../utils/express/express-handler";
import { genericArraySolutionInvitationFilter } from "../../utils/field-filters/invitation";
import { removeEmpty } from "../../utils/general/remove-empty";

const usersInvites = validate(
  {
    query: z.object({
      status: z.array(z.nativeEnum(INVITATION_STATUS)).optional(),
    }),
  },
  async ({ user, query: { status } }, res) => {
    const invites = await SolutionInvitation.find(
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

    return genericArraySolutionInvitationFilter(invites);
  }
);

export const usersController = {
  usersInvites,
};
