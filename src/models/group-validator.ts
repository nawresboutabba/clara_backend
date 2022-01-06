import { Schema, model } from "mongoose";
import { AreaI } from "./organization.area";

export interface GroupValidatorI {
    groupValidatorId: string,
    name: string,
    created: Date,
    area: AreaI,
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
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area'
    }
})

export default model('GroupValidator', groupValidator);