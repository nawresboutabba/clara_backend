import { AreaI } from "../../models/organization.area";
import { TagI } from "../../models/tag";
import {
  QuerySituationForm,
  formatSituationQuery,
} from "./situation.query.params";

export interface QuerySolutionForm extends QuerySituationForm {
  challengeId?: string;
  type: string;
}

interface SituationResources {
  tags?: TagI[];
  departmentAffected?: AreaI[];
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
