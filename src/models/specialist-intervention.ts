import { Schema, model } from "mongoose";
import { BaremoI } from "./baremo";
import { GroupValidatorI } from "./group-validator";
import { ChallengeI } from "./situation.challenges";
import { SolutionI } from "./situation.solutions";
import { UserI } from "./users";

export interface SpecialistInterventionI {
    groupValidator: GroupValidatorI,
    user: UserI,
    baremo: BaremoI,
    situation: ChallengeI | SolutionI
}

const specialistIntervention = new Schema({
	groupValidator: {
		type: Schema.Types.ObjectId,
		ref: 'GroupValidator'
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	baremo: {
		type: Schema.Types.ObjectId,
		ref: 'Baremo'
	},
	situation: {
		type: Schema.Types.Mixed
	}
})

specialistIntervention.index({situation:1, user:1}, {unique:true})

export default model('Baremo', specialistIntervention);