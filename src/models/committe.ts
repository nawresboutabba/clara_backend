import { Schema, model } from "mongoose";
import { IntegrantI } from "./integrant";

export interface CommitteI {
    active: boolean,
    leader?: IntegrantI,
    general?: Array<IntegrantI>
}

const committe = new Schema({
    active: {
        type: Boolean,
        unique: true,
        default:true
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'Integrant'
    },
    committe: [{
        type: Schema.Types.ObjectId,
        ref: 'Integrant'
    }],
})
export default model('Committe', committe);