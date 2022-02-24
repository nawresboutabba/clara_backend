import { Schema, model } from "mongoose";

export interface GroupValidatorI {
    groupValidatorId: string,
    name: string,
    created: Date,
}

const groupValidator = new Schema({
	groupValidatorId: String,
	name: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		required: true
	},
})

export default model('GroupValidator', groupValidator);