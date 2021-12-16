import { Schema, model } from "mongoose";
import { UserI } from "./users";
import { GroupValidatorI } from "./group-validator";

export interface CommitteI {
    leader: UserI,
    general: Array<UserI>
}

const committe = new Schema({
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    committe: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
})

export default model('Committe', committe);