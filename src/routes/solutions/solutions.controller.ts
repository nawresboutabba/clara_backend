import { z } from "zod";
import { EVENTS_TYPE, WSALEVEL } from "../../constants";
import {
  INVITATION_STATUS,
  INVITATION_TYPE,
  SolutionInvitation,
} from "../../models/invitation";
import Solution, { SOLUTION_STATUS } from "../../models/situation.solutions";
import User, { UserI } from "../../models/users";
import { sendEmail } from "../../repository/repository.mailing";
import { newExternalUser } from "../../repository/repository.users";
import InvitationService from "../../services/Invitation.service";
import UserService from "../../services/User.service";
import { validate } from "../../utils/express/express-handler";
import {
  genericArraySolutionInvitationFilter,
  genericSolutionInvitationFilter,
} from "../../utils/field-filters/invitation";
import {
  genericArraySolutionsFilter,
  genericSolutionFilter,
} from "../../utils/field-filters/solution";
import { getCurrentDate } from "../../utils/general/date";
import { generatePassword } from "../../utils/general/generate-password";
import { logVisit } from "../../utils/general/log-visit";
import { removeEmpty } from "../../utils/general/remove-empty";
import { sortSchema } from "../../utils/params-query/sort.query";
import * as SolutionRep from "./solutions.repository";

export const getSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
  },
  async ({ user, params: { solutionId } }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    // const integrantStatus = await IntegrantService.checkUserInCommittee(user);
    // const isCommitteeMember = integrantStatus.isActive;
    const haveInvites = await SolutionInvitation.find({
      to: user,
      resource: solution,
      status: INVITATION_STATUS.PENDING,
    }).count();

    const isAuthor = solution.author.userId === user.userId;
    const isInvited = haveInvites > 0;
    const isCoAuthor = solution.coauthor.some((e) => e.userId === user.userId);
    const isExternalOption = solution.externalOpinion.some(
      (e) => e.userId === user.userId
    );

    if (
      solution.status !== SOLUTION_STATUS.APPROVED_FOR_DISCUSSION &&
      !isInvited &&
      !isAuthor &&
      !isCoAuthor &&
      !isExternalOption
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    if (solution.status === SOLUTION_STATUS.APPROVED_FOR_DISCUSSION) {
      const hasCommonAreas = solution.areasAvailable.some((area) =>
        user.areaVisible.find((userArea) => userArea.areaId === area.areaId)
      );

      const hasWsaCompany = solution.WSALevelChosed == WSALEVEL.COMPANY;

      const hasWsaArea =
        solution.WSALevelChosed == WSALEVEL.AREA && hasCommonAreas === false;

      if (!hasWsaCompany && !hasWsaArea) {
        return res.status(403).json({ message: "not authorized" });
      }
    }

    logVisit(user, solution);
    return genericSolutionFilter(solution);
  }
);

export const changeAuthor = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({ userId: z.string() }),
  },
  async ({ params: { solutionId }, user, body }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    const newAuthor = await User.findOne({ userId: body.userId });

    if (
      solution.author.userId !== user.userId &&
      !solution.coauthor.some((e: UserI) => e.userId === newAuthor.userId)
    ) {
      return res.status(403).json({ message: "not authorized" });
    }

    await Solution.updateOne(
      { solutionId },
      {
        $pull: { coauthor: newAuthor._id },
      }
    );

    const updatedSolution = await SolutionRep.updateSolutionPartially(
      solutionId,
      {
        $set: { author: newAuthor },
        $addToSet: { coauthor: user },
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);

export const leaveSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
  },
  async ({ params: { solutionId }, user }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    if (solution.author.userId === user.userId) {
      return res.status(403).json({ message: "author cannot leave" });
    }

    if (solution.coauthor.every((e) => e.userId !== user.userId)) {
      return res.status(403).json({ message: "you are not in the team" });
    }

    const updatedSolution = await SolutionRep.updateSolutionPartially(
      solutionId,
      {
        $pull: { coauthor: user._id },
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);

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

export const getSolutions = validate(
  {
    query: z
      .object({
        title: z.string(),
        tags: z.array(z.string()),
        departmentAffected: z.array(z.string()),
        status: z.nativeEnum(SOLUTION_STATUS),
        challengeId: z.string(),
        type: z.enum(["PARTICULAR", "GENERIC"]),
        as: z.enum(["AUTHOR", "COAUTHOR"]),
        init: z.number().default(0),
        offset: z.number().default(10),
        sort: z
          .object({ title: sortSchema, created: sortSchema.default(-1) })
          .partial(),
      })
      .partial(),
  },
  async ({ user, query }) => {
    const filterQuery = Object.assign(
      { active: true },
      removeEmpty({
        status: query?.status,
        type: query?.type,
        // TODO fix tags and department
        tags: query?.tags,
        departmentAffected: query?.departmentAffected,
      }),
      query.title && {
        title: { $regex: `.*${query.title}.*`, $options: "i" },
      },
      query.as === "AUTHOR" && {
        author: user,
      },
      query.as === "COAUTHOR" && {
        coauthor: user,
      }
    );

    const hasUserQuery = {
      $or: [{ author: user }, { coauthor: user }, { externalOpinion: user }],
    };

    const solutions = await SolutionRep.getSolutions({
      $and: [hasUserQuery, filterQuery],
    })
      .skip(query.init)
      .limit(query.offset)
      .sort(query.sort);
    return genericArraySolutionsFilter(solutions);
  }
);
