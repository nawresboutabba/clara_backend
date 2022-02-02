import { PARTICIPATION_MODE } from "../../constants";
import { QuerySituationForm, formatSitutationQuery } from "./situation.query.params";

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

export function formatChallengeQuery(query:any): Promise<QueryChallengeForm>{
    return new Promise(async (resolve, reject)=> {
        const querySituationForm:QuerySituationForm = await formatSitutationQuery(query)
        let { 
            is_strategic,
            participation_mode
        } = query

        let queryChallengeForm: QueryChallengeForm = {
            ... querySituationForm,
        }

        if (is_strategic){
            const isStrategic: boolean = (is_strategic != undefined && is_strategic.toLowerCase() == 'true') ? true : false;
            queryChallengeForm.isStrategic = isStrategic
        }
        
        const participationMode = modalitySwitch(participation_mode)

        queryChallengeForm.participationMode = participationMode

        return resolve(queryChallengeForm)
    })
}