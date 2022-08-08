import { AreaI } from "../../models/organization.area";
import { TagI } from "../../models/tag";
import { removeEmpty } from "../general/remove-empty";
import { QuerySolutionForm } from "./solution.query.params";

export interface QuerySituationForm {
  created?: createdFilter;
  init?: number;
  offset?: number;
  groupValidatorId?: string;
  sort?: {
    title: string;
    created: string;
  };
  title?: string;
  status?: string;
  tags?: { $in: TagI[] };
  departmentAffected?: { $in: AreaI[] };
  type: string;
}

export interface createdFilter {
  $lte?: Date;
  $gte?: Date;
}

// situation
interface SituationResources {
  tags?: TagI[];
  departmentAffected?: AreaI[];
}

export async function formatSituationQuery(
  query: any,
  resources: SituationResources = {}
): Promise<QuerySituationForm> {
  try {
    /**
     * Pagination extraction and cleaning
     */
    let { init, offset } = query;
    const { group_validator_id, status } = query;
    init = query.init ? parseInt(query.init.toString()) : 0;
    offset = query.offset ? parseInt(query.offset.toString()) : 10;
    /**
     * Date filter
     */
    const { created_lt: $lte, created_gt: $gte } = query;

    const created: createdFilter = {};
    created.$gte = $gte;
    created.$lte = $lte;

    /**
     * String filters
     */
    const { title } = query;
    /**
     * Order filter
     */
    const { created_order, title_order, challengeType } = query;

    const queryForm: QuerySolutionForm = {
      init,
      offset,
      sort: {
        title: title_order,
        created: created_order ? created_order : -1,
      },
      type: challengeType,
      challengeId: query.challengeId,
      groupValidatorId: group_validator_id,
      status,
    };

    if (resources.tags) {
      queryForm.tags = {
        $in: resources.tags,
      };
    }
    if (resources.departmentAffected) {
      queryForm.departmentAffected = {
        $in: resources.departmentAffected,
      };
    }
    queryForm.title = title ? title : "";

    return removeEmpty(queryForm);
  } catch (error) {
    return Promise.reject(error);
  }
}
