import { z } from "zod";
import {
  INVITATION_STATUS
} from "../../../models/invitation";
import { UserI } from "../../../models/users";
import InvitationService from "../../../services/Invitation.service";
import { validate } from "../../../utils/express/express-handler";
import {
  genericArraySolutionInvitationFilter
} from "../../../utils/field-filters/invitation";
import { removeEmpty } from "../../../utils/general/remove-empty";
import * as SolutionRep from "../solutions.repository";

export const getSolutionInvites = validate(
  {
    params: z.object({ solutionId: z.string() }),
    query: z.object({ status: z.nativeEnum(INVITATION_STATUS) }).partial(),
  },
  async ({ user, params: { solutionId }, query: { status } }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);
    if (
      solution.author.userId !== user.userId &&
      solution.coauthor.every((e: UserI) => e.userId !== user.userId)
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    const invitations = await InvitationService.getSolutionInvitations(
      removeEmpty({
        resource: solution,
        status,
      })
    );

    return genericArraySolutionInvitationFilter(invitations);
  }
);
