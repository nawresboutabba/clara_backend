import { Schema, model } from "mongoose";
import { GroupValidatorI } from "./group-validator";
import { UserI } from "./users";
import { BaremoI } from "./baremo";

export interface ValidatorI {
    /**
     * Validator User
     */
    user: UserI,
    /**
     * Validator Id
     */
    validatorId: string,
    active: boolean,
    created: Date,
    finished?: Date
}

const baremo = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    validatorId: {
        type: String,
        required: true
    },
    active:{
        type:Boolean,
        default: true,
        required:true
    },
    created: Date,
    finished: Date
})

export default model('Validator', baremo);