import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import { genericSolutionFilter } from "../solution.serializer";
import { logVisit } from "../../../utils/general/log-visit";
import * as SolutionRep from "../solution.repository";

export const getSolution = validate(
  {
    params: z.object({ solutionId: z.string() }),
  },
  async ({ user, params: { solutionId } }, res) => {
    const solution = await SolutionRep.getSolutionById(solutionId);

    // const integrantStatus = await IntegrantService.checkUserInCommittee(user);
    // const isCommitteeMember = integrantStatus.isActive;
    if (!SolutionRep.canViewSolution(user, solution)) {
      return res.status(403).json({ message: "not authorized" });
    }

    logVisit(user, solution);
    return genericSolutionFilter(solution);
  }
);
