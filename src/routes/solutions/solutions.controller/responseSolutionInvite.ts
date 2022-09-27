import { z } from "zod";
import {
  INVITATION_STATUS,
  INVITATION_TYPE,
  SolutionInvitation
} from "../../../models/invitation";
import Solution from "../../../models/situation.solutions";
import { validate } from "../../../utils/express/express-handler";
import {
  genericSolutionInvitationFilter
} from "../../../utils/field-filters/invitation";
import { getCurrentDate } from "../../../utils/general/date";

export const responseSolutionInvite = validate(
  {
    params: z.object({ solutionId: z.string(), invitationId: z.string() }),
    body: z.object({
      response: z.enum([
        INVITATION_STATUS.ACCEPTED,
        INVITATION_STATUS.REJECTED,
      ]),
    }),
  },
  async (
    { user, params: { invitationId, solutionId }, body: { response } },
    res
  ) => {
    const invite = await SolutionInvitation.findById(invitationId)
      .populate({
        path: "resource",
        populate: { path: "challenge" },
      })
      .populate("from")
      .populate("to");

    if (invite.to.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" });
    }
    if (invite.status !== INVITATION_STATUS.PENDING) {
      return res
        .status(403)
        .json({ message: "The invitation cannot be answered" });
    }

    if (response === INVITATION_STATUS.ACCEPTED) {
      await Solution.updateOne(
        { solutionId },
        {
          $addToSet:
            invite.type === INVITATION_TYPE.EXTERNAL_OPINION
              ? { externalOpinion: user }
              : { coauthor: user },
        }
      );
    }

    invite.decisionDate = getCurrentDate();
    invite.status = response;
    return genericSolutionInvitationFilter(await invite.save());
  }
);
