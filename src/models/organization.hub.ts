import { Schema, model } from 'mongoose';

export interface HubI {
    hubId: string,
    name:string
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
    }
})

export default model('Hub', hub);
