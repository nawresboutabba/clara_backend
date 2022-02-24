import { Schema, model } from 'mongoose';

export interface AreaI {
    areaId:string,
    name: string,
}

const area =  new Schema({
	areaId: {
		type: String,
		required: true, 
	},
	name: {
		type:String,
		required: true,
		unique: true
	}
})

export default model('Area', area)