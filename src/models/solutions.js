const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solution = new Schema ({
    solutionId: String,
    idChallenge: String,
    authorEmail: String,
    created: { 
        type: Date, 
        default: Date.now 
    },
    updated: { 
        type: Date, 
        default: Date.now 
    },
    description: String,
    images: [{
        type: String
    }],
    canChooseScope: { 
        type: Boolean, 
        default: true 
    },
    active:{
        type: Boolean,
        default: true
    },
    isPrivate: { 
        type: Boolean, 
        default: true 
    },
    status: String,
    timeInPark:  { 
        type: Number, 
        default: null 
    },
    baremoValidator: [{
        type: String
    }],
    baremoReferrer: [{
        type: String
    }],
    calification: {
        complexity: Number,
        impact: Number
    },
    reactions: {
        likes: Number,
        confused: Number
    }
});



module.exports = mongoose.model('Solution', solution)