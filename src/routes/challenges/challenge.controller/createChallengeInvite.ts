import { z } from "zod";
import { EVENTS_TYPE } from "../../../constants";
import { ChallengeInvitation, INVITATION_STATUS, INVITATION_TYPE } from "../../../models/invitation";
// import Challenge from "../../../models/situation.challenges";
import { sendEmail } from "../../../repository/repository.mailing";
import { newExternalUser } from "../../../repository/repository.users";
import UserService from "../../../services/User.service";
import { validate } from "../../../utils/express/express-handler";
import { genericChallengeInvitationFilter } from "../../../utils/field-filters/invitation";
import { generatePassword } from "../../../utils/general/generate-password";
import * as ChallengeRep from "../challenges.repository"

// TODO throw error if invitation is to committee member
export const createChallengeInvite = validate(
  {
    params: z.object({ challengeId: z.string() }),
    body: z.object({
      email: z.string().email(),
    }),
  },
  async ({ user, params: { challengeId }, body: { email } }, res) => {
    const challenge = await ChallengeRep.getChallengeById(challengeId);

    if (challenge.author.userId !== user.userId) {
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

    const alreadyMember = challenge.coauthor.find(
      (member) => member.userId === userToInvite.userId
    );
    if (alreadyMember) {
      return res.status(403).json({ message: "this user is already member" });
    }

    const hasOldInvitation = await ChallengeInvitation.find({
      to: userToInvite,
      resource: challenge,
      status: INVITATION_STATUS.PENDING,
    });

    if (hasOldInvitation.length > 0) {
      return res.status(400).json({ message: "User has invite" });
    }

    const createdInvitation = await ChallengeInvitation.create({
      from: user,
      to: userToInvite,
      resource: challenge,
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
      resource: challenge,
      invitation: createdInvitation,
    });

    return res.status(201).json(await genericChallengeInvitationFilter(createdInvitation));
  }
);
