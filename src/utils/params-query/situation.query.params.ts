import * as _ from 'lodash'
import { QuerySolutionForm } from './solution.query.params'

export interface QuerySituationForm {
  created?: createdFilter,
  init?: number,
  offset?: number,
  groupValidatorId?: string,
  sort?: {
    title: string,
    created: string
  }
  title?: string,
  status?: string,
}

export interface createdFilter {
  $lte?: Date,
  $gte?: Date
}

export async function formatSitutationQuery(query: any, resources:any): Promise<QuerySituationForm> {
  try {
    /**
      * Pagination extraction and cleaning
      */
    let { init, offset } = query
    const { group_validator_id, status } = query
    init = query.init ? parseInt(query.init.toString()) : 0;
    offset = query.offset? parseInt(query.offset.toString()) : 10;
    /**
      * Date filter
      */
    const { created_lt: $lte, created_gt: $gte } = query

    const created: createdFilter = {}
    created.$gte = $gte 
    created.$lte = $lte

    /**
      * String filters
      */
    const { title } = query
    /**
      * Order filter
      */
    const { created_order, title_order } = query

    let queryForm: QuerySolutionForm = {
      init,
      offset,
      sort: {
        title: title_order,
        created: created_order? created_order: -1
      },
      challengeId : resources?.challenge.challengeId || resources?.solution.challenge.challengeId,
      groupValidatorId: group_validator_id,
      status
    }

    queryForm.title = title ? title : ''

    queryForm = JSON.parse(JSON.stringify(queryForm))

    return queryForm
  } catch (error) {
    return Promise.reject(error)
  }
}