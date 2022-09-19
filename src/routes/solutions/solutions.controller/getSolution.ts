import { z } from "zod";
import { WSALEVEL } from "../../../constants";
import {
  INVITATION_STATUS, SolutionInvitation
} from "../../../models/invitation";
import { SOLUTION_STATUS } from "../../../models/situation.solutions";
import { validate } from "../../../utils/express/express-handler";
import {
  genericSolutionFilter
} from "../../../utils/field-filters/solution";
import { logVisit } from "../../../utils/general/log-visit";
import * as SolutionRep from "../solutions.repository";

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
