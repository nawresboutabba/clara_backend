import { Schema, model } from "mongoose";

const configuration = new Schema ({
    idConfiguration: String,
    idVersion: String,
    // Leader that create a configuration
    authorEmail: String,
    version: String,
    created: { 
        type: Date, 
        default: Date.now 
    },
    description: String,
    canChooseScope: { 
        type: Boolean, 
        default: true 
    },
    timeInPark: Number
});

export default model('Configuration', configuration);