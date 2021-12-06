import { Schema, model } from 'mongoose';

export interface HubI {
    name?:string
}

const hub = new Schema({
    name: {
        type:String,
    required: true}
})

export default model('Hub', hub);
