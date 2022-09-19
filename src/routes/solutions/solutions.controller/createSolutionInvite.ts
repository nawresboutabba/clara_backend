import { z } from "zod";
import { EVENTS_TYPE } from "../../../constants";
import {
  INVITATION_STATUS,
  INVITATION_TYPE,
  SolutionInvitation
} from "../../../models/invitation";
import { sendEmail } from "../../../repository/repository.mailing";
import { newExternalUser } from "../../../repository/repository.users";
import UserService from "../../../services/User.service";
import { validate } from "../../../utils/express/express-handler";
import {
  genericSolutionInvitationFilter
} from "../../../utils/field-filters/invitation";
import { generatePassword } from "../../../utils/general/generate-password";
import * as SolutionRep from "../solutions.repository";

export const createSolutionInvite = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({
      email: z.string().email(),
    }),
  },
  async ({ user, params: { solutionId }, body: { email } }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    if (solution.author.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" });
    }

    let userToInvite = await UserService.getUserActiveByEmail(email);
    if (userToInvite === null) {
      await newExternalUser(email, generatePassword());
      userToInvite = await UserService.getUser({
        email,
        active: false,
        confirmed: false,
      });
    }

    const alreadyMember = solution.coauthor.find(
      (member) => member.userId === userToInvite.userId
    );
    if (alreadyMember) {
      return res.status(403).json({ message: "this user is already member" });
    }

    const hasOldInvitation = await SolutionInvitation.find({
      to: userToInvite,
      resource: solution,
      status: INVITATION_STATUS.PENDING,
    });

    if (hasOldInvitation.length > 0) {
      return res.status(400).json({ message: "User has invite" });
    }

    const createdInvitation = await SolutionInvitation.create({
      from: user,
      to: userToInvite,
      resource: solution,
      type: userToInvite.externalUser
        ? INVITATION_TYPE.EXTERNAL_OPINION
        : INVITATION_TYPE.TEAM_PARTICIPATION,
    });

    const Destination = {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [userToInvite.email],
    };

    await sendEmail(Destination, EVENTS_TYPE.EXTERNAL_OPINION_INVITATION, {
      solution,
      invitation: createdInvitation,
    });

    return genericSolutionInvitationFilter(createdInvitation);
  }
);
