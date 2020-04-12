const mongoose = require('mongoose');

const RegionSchema = mongoose.Schema({
    name:{
        type: String,
    },
    regionCode:{
        type: Number
    },
    codes:{
        type:Object,
    }
});

module.exports = mongoose.model('Region', RegionSchema);