import { ChallengeI } from "../../routes/challenges/challenge.model";
import { SolutionI } from "../../models/situation.solutions";
import { UserI } from "../../models/users";
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
