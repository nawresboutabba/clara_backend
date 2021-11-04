const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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



module.exports = mongoose.model('Configuration', configuration)