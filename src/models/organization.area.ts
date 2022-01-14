import { Schema, model } from 'mongoose';
import { CompanyI } from './organizacion.companies';

export interface AreaI {
    areaId:string,
    name: string,
    company: CompanyI
}

const area =  new Schema({
    areaId: {
        type: String,
        required: true, 
        unique: true
    },
    name: {
        type:String,
        required: true,
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company',
        required: true }
})

area.index({name:1, company:1}, {unique:true})

export default model('Area', area)