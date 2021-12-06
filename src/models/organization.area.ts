import { Schema, model } from 'mongoose';
import { CompanyI } from './organizacion.companies';

export interface AreaI {
    name?: string,
    company?: CompanyI
}

const area =  new Schema({
    name: String,
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company',
        required: true }
})

export default model('Area', area)