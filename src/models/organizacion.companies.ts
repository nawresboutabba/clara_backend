import { Schema, model } from 'mongoose';
import { HubI } from './organization.hub';

export interface CompanyI {
    _id?: any,
    companyId: string,
    name?:string,
    CNPJ?: string,
    active: boolean,
    hub: HubI[]
}

const company = new Schema({
    companyId: {
        type:String,
        required: true,
        unique: true
    }, 
    name: {
        type: String,
        required: true,
        unique: true
    },
    CNPJ: {
        type:String,
        required: true,
        unique:true
    },
    active:{
        type: Boolean,
        default: true
    },
    hub: [{ type: Schema.Types.ObjectId, ref: 'Hub' }]
})

export default model('Company', company);