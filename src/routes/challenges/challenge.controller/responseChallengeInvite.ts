import { z } from "zod";
import { ChallengeInvitation, INVITATION_STATUS } from "../../../models/invitation";
import Challenge from "../../../models/situation.challenges";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeInvitationFilter } from "../../../utils/field-filters/invitation";
import { getCurrentDate } from "../../../utils/general/date";

export const responseChallengeInvite = validate(
  {
    params: z.object({ challengeId: z.string(), invitationId: z.string() }),
    body: z.object({
      response: z.enum([
        INVITATION_STATUS.ACCEPTED,
        INVITATION_STATUS.REJECTED,
      ]),
    }),
  },
  async (
    { user, params: { invitationId, challengeId }, body: { response } },
    res
  ) => {
    const invite = await ChallengeInvitation.findById(invitationId)
      .populate("resource")
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
      await Challenge.findByIdAndUpdate(
        challengeId,
        {
          $addToSet: { coauthor: user },
        }
      );
    }

    invite.decisionDate = getCurrentDate();
    invite.status = response;
    return genericChallengeInvitationFilter(await invite.save());
  }
);
