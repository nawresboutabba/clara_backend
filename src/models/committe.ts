import { Schema, model } from "mongoose";
import { UserI } from "./users";

export interface CommitteI {
    active: boolean,
    leader?: UserI,
    general?: Array<UserI>
}

const committe = new Schema({
    active: {
        type: Boolean,
        unique: true,
        default:true
    },
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