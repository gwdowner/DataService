const PV_Live = require('../3rdPartyServiceHandlers/pv_live');
const SolarData = require('../Data/solarData');
const Update = require('../Data/update');

async function run() {
    try {
        // get latest update and set date range for data
        const latest = await Update.findOne().sort({ timeStamp: -1 });
        var start = latest ? latest.timeStamp : new Date(process.env.DATA_START_DATE);
        var end = new Date(Date.now());

        // get data
        var solarData = await PV_Live.getData(start.toISOString(), end.toISOString()).then();
        solarData = PV_Live.rawDataToSolarData(solarData);

        // insert data into db
        await SolarData.insertMany(solarData);

        // create new update
        await new Update({ timeStamp: end }).save();
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = run;