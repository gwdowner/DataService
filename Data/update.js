const mongoose = require('mongoose');

const UpdateSchema = mongoose.Schema({
    timeStamp:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Update', UpdateSchema);


