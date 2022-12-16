import { z } from "zod";
import {
  INVITATION_STATUS,
  INVITATION_TYPE,
  SolutionInvitation,
} from "../../../models/invitation";
import Solution from "../solution.model";
import { validate } from "../../../utils/express/express-handler";
import { genericSolutionInvitationFilter } from "../../../utils/field-filters/invitation";
import { getCurrentDate } from "../../../utils/general/date";
import nodemailer from "nodemailer";
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
              //****************************email */
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'tecnologia@claraidea.com.br',
                  pass: 'Tecnologia1*'
                }
              });
              
            const mailOptions = {
                from: 'tecnologia@claraidea.com.br',
                to: user.email,
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
      
        //****************************email */
    }

    invite.decisionDate = getCurrentDate();
    invite.status = response;
    return genericSolutionInvitationFilter(await invite.save());
  }
);
