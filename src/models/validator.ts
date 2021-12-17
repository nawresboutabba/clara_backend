import { Schema, model } from "mongoose";
import { GroupValidatorI } from "./group-validator";
import { UserI } from "./users";
import { BaremoI } from "./baremo";

export interface ValidatorI {
    groupValidator: GroupValidatorI
    user: UserI,
    baremo: Array<BaremoI>,
}

const baremo = new Schema({
    groupValidator: {
        type: Schema.Types.ObjectId,
        ref: 'Validator'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    baremo: [{
        type: Schema.Types.ObjectId,
        ref: 'Baremo'
    }],
})

export default model('Validator', baremo);