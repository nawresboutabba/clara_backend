import { FilterQuery, UpdateQuery } from "mongoose";
import { WSALEVEL } from "../../constants";
import { INVITATION_STATUS, SolutionInvitation } from "../../models/invitation";
import Solution, { SolutionI, SOLUTION_STATUS } from "../../models/situation.solutions";
import { UserI } from "../../models/users";

export function getSolutionById(solutionId: string) {
  return Solution.findOne({ solutionId })
    .populate("departmentAffected")
    .populate("updatedBy")
    .populate("challenge")
    .populate("author")
    .populate("coauthor")
    .populate("team")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("tags")
    .populate("externalOpinion");
}

export function updateSolutionPartially(
  solutionId: string,
  data: UpdateQuery<SolutionI>
) {
  return Solution.findOneAndUpdate({ solutionId }, data, { new: true })
    .populate("departmentAffected")
    .populate("updatedBy")
    .populate("challenge")
    .populate("author")
    .populate("coauthor")
    .populate("team")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("tags")
    .populate("externalOpinion");
}

export function getSolutions(filterQuery: FilterQuery<SolutionI>) {
  return Solution.find(filterQuery)
    .populate("departmentAffected")
    .populate("challenge")
    .populate("author")
    .populate("coauthor")
    .populate("team")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("tags")
    .populate("groupValidator");
}

export async function canViewSolution(user: UserI, solution: SolutionI) {
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
    return false;
  }

  if (solution.status === SOLUTION_STATUS.APPROVED_FOR_DISCUSSION) {
    const hasCommonAreas = solution.areasAvailable.some((area) =>
      user.areaVisible.find((userArea) => userArea.areaId === area.areaId)
    );

    const hasWsaCompany = solution.WSALevelChosed == WSALEVEL.COMPANY;

    const hasWsaArea =
      solution.WSALevelChosed == WSALEVEL.AREA && hasCommonAreas === false;

    if (!hasWsaCompany && !hasWsaArea) {
      return false;
    }
  }

  return true;
}
