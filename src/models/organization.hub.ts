import { Schema, model } from 'mongoose';

export interface HubI {
    _id?: any,
    hubId: string,
    name:string,
    active: boolean
}

const hub = new Schema({
    hubId: {
        type:String,
        required:true,
        unique:true
    },
    name: {
        type:String,
        required: true,
        unique:true
    },
    active:{
        type: Boolean,
        required: true
    }
})

export default model('Hub', hub);
