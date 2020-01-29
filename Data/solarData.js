const mongoose = require('mongoose');

const SolarDataSchema = mongoose.Schema({
    region:{
        type:Number,
    },
    time:{
        type:Date,
        default:Date.now()
    },
    outputMW:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('SolarData', SolarDataSchema);


