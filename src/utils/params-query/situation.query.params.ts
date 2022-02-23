import * as _ from 'lodash'

export interface QuerySituationForm {
  created?: createdFilter,
  init?: number,
  offset?: number,
  sort?: {
    title: string,
    created: string
  }
  title?: string
}

export interface createdFilter {
  $lte?: Date,
  $gte?: Date
}

export async function formatSitutationQuery(query: any): Promise<QuerySituationForm> {
  try {
    /**
      * Pagination extraction and cleaning
      */
    let { init, offset } = query
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

    let queryForm: QuerySituationForm = {
      init,
      offset,
      sort: {
        title: title_order,
        created: created_order
      },
    }

    queryForm.title = title ? title : ''

    queryForm = JSON.parse(JSON.stringify(queryForm))

    return queryForm
  } catch (error) {
    return Promise.reject(error)
  }
}