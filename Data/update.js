const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const UpdateSchema = mongoose.Schema({
    timeStamp: {
        type: Date,
        default: Date.now()
    },
    region: {
        type: ObjectId,
        ref: 'Region'
    }
});

UpdateSchema.statics.getLatestUpdateByRegion = async function () {
    return await this.aggregate([
        { $sort: { timeStamp: 1 } },
        {
            $group:
            {
                _id: "$region",
                time: { $last: "$timeStamp" }

            }
        }
    ]).then(res => {
        return res;
    });
}

module.exports = mongoose.model('Update', UpdateSchema);



