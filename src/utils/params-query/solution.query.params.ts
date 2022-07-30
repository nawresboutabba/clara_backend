import { ChallengeI } from "../../models/situation.challenges";
import { SolutionI } from "../../models/situation.solutions";
import { TagI } from "../../models/tag";
import {
  QuerySituationForm,
  formatSituationQuery,
} from "./situation.query.params";

export interface QuerySolutionForm extends QuerySituationForm {
  challengeId?: string;
  challenge?: { type: string };
}

interface SituationResources {
  tags?: TagI[];
}

export async function formatSolutionQuery(
  query: any,
  resources: SituationResources
): Promise<QuerySolutionForm> {
  try {
    const querySolutionForm: QuerySolutionForm = await formatSituationQuery(
      query,
      resources
    );
    return querySolutionForm;
  } catch (error) {
    return Promise.reject(error);
  }
}
