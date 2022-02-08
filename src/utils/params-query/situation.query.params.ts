import checkISOData from "../date";
import * as _ from 'lodash'

export interface QuerySituationForm {
    created?: createdFilter,
    init?: number,
    offset?: number,
    sort?: {
        title:string,
        created: string    
    }
    title?: string
}

export interface createdFilter {
    $lte?:Date,
    $gte?: Date
}

export function formatSitutationQuery(query: any): Promise<QuerySituationForm> {
    return new Promise((resolve, reject)=> {
        /**
         * Pagination extraction and cleaning
         */
         let { init, offset } = query
         init = parseInt(query.init.toString()) || 0;
         offset = parseInt(query.offset.toString()) || 10;
         /**
          * Date filter
          */
         let { created_lt: $lte, created_gt: $gte }= query

         let created: createdFilter ={}
         created.$gte= $gte
         created.$lte = $lte

         /**
          * String filters
          */
          const { title  }= query     
          /**
           * Order filter
           */
          const { created_order, title_order }= query

          const queryForm: QuerySituationForm = {
              init,
              offset,
              sort :{
                  title: title_order,
                  created: created_order
              },
          }
            
          queryForm.title = title ? title : ''         
 

          if (!(_.isEmpty(created))){
            queryForm.created = created
          }
          return resolve(queryForm)
    })
}