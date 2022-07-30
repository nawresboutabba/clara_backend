import { PARTICIPATION_MODE } from "../../constants";
import { TagI } from "../../models/tag";
import { QuerySituationForm, formatSituationQuery } from "./situation.query.params";

function modalitySwitch(modality:string){
  switch(modality){
  case '0': 
    return [PARTICIPATION_MODE.TEAM]
  case '1':
    return [PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP]
  default:
    return [PARTICIPATION_MODE.TEAM,PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP]
  }
}

export interface QueryChallengeForm extends QuerySituationForm {
    isStrategic?: boolean,
    participationMode?: Array<string>
}

export async function formatChallengeQuery(query:any, resources: any): Promise<QueryChallengeForm>{
  try{
    const querySituationForm:QuerySituationForm = await formatSituationQuery(query, resources)
    const { 
      is_strategic,
      participation_mode
    } = query
    
    const queryChallengeForm: QueryChallengeForm = {
      ... querySituationForm,
    }

    if (is_strategic) {
      const isStrategic: boolean = (is_strategic != undefined && is_strategic.toLowerCase() == 'true') ? true : false;
      queryChallengeForm.isStrategic = isStrategic
    }

    const participationMode = modalitySwitch(participation_mode)
    
    queryChallengeForm.participationMode = participationMode
    
    return queryChallengeForm
  }catch(error){
    return Promise.reject(error)
  }
}