const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const TrainingDataSchema = mongoose.Schema({
    time:{
        type:Date,
    },
    region:{
        type:ObjectId,
        ref: 'Region'
    },
    solarMW:{
        type:Number,
        default:0
    },
    temperature:{
        type:Number,
        default:0
    },
    windspeed:{
        type:Number,
        default:0
    },
    condition:{
        type:Number,
        default:0
    }

});

module.exports = mongoose.model('TrainingData',TrainingDataSchema);