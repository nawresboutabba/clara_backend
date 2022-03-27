import { QuerySituationForm, formatSitutationQuery } from "./situation.query.params";

export interface QuerySolutionForm extends QuerySituationForm {
  challengeId?: string
}


export async function formatSolutionQuery(query: any): Promise<QuerySolutionForm> {
  try{
    
    const querySolutionForm: QuerySolutionForm = await formatSitutationQuery(query)
    return querySolutionForm
  }catch(error){
    return Promise.reject(error)
  }
}