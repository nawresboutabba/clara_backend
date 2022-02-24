import { Schema, model } from 'mongoose';
import { UserI } from './users';

export interface CompanyI {
    _id?: any,
    companyId: string,
    name?:string,
    CNPJ?: string,
    committe?: Array<UserI>
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
	committe: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
})

export default model('Company', company);