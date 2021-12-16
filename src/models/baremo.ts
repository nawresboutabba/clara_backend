import { Schema, model } from "mongoose";
import { ChallengeI } from "./situation.challenges";
import { SolutionI } from "./situation.solutions";
import { ValidatorI } from "./validator";
import { SpecialistInterventionI } from "./specialist-intervention";

export interface BaremoI {
    intervention: ValidatorI | SpecialistInterventionI,
    situation: ChallengeI | SolutionI,
    comment: String
}

const baremo = new Schema({
    intervention: {
        type: Schema.Types.Mixed,
    },
    situation: {
        type: Schema.Types.Mixed,
    },
    comment: String
})

baremo.index({intervention:1, situation:1}, {unique:true})

export default model('Baremo', baremo);