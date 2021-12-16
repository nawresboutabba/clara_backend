import { Schema, model } from "mongoose";
import { AreaI } from "./organization.area";
import { ValidatorI } from "./validator";

export interface GroupValidatorI {
    validators: Array<ValidatorI>,
    area: AreaI,
}

const groupValidator = new Schema({
    validators: [{
        type: Schema.Types.ObjectId,
        ref: 'Validator'
    }],
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area'
    }
})

export default model('GroupValidator', groupValidator);