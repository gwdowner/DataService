const mongoose = require('mongoose');

const UpdateSchema = mongoose.Schema({
    timeStamp:{
        type:Date,
        default:Date.now()
    },
    numUpdates:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('Update', UpdateSchema);


