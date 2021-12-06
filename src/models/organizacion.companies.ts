import { Schema, model } from 'mongoose';
import { HubI } from './organization.hub';

export interface CompanyI {
    name?:string,
    CNPJ?: string,
    hub: HubI
}

const company = new Schema({
    name: String,
    CNPJ: String,
    hub: { type: Schema.Types.ObjectId, ref: 'Hub' }
})

export default model('Company', company);