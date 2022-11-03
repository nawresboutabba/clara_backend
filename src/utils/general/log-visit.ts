import { ChallengeI } from "../../routes/challenges/challenge.model";
import { SolutionI } from "../../routes/solutions/solution.model";
import { UserI } from "../../routes/users/users.model";
import VisitService from "../../services/Visit.service";
import { getCurrentDate } from "./date";

export const logVisit = async (
  user: UserI,
  resource: ChallengeI | SolutionI
): Promise<void> => {
  const date = getCurrentDate();
  VisitService.newVisit(user, resource, date);
  return Promise.resolve();
};
