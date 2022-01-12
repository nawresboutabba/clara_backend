import * as _ from 'lodash'
import { QuerySituationForm, formatSitutationQuery } from "./situation.query.params";

export interface QuerySolutionForm extends QuerySituationForm{
}


export function formatSolutionQuery(query: any): Promise<QuerySolutionForm> {
    return new Promise(async (resolve, reject)=> {
        const querySolutionForm: QuerySolutionForm = await formatSitutationQuery(query)
          return resolve(querySolutionForm)
    })
}