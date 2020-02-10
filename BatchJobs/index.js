const PV_Live = require('../3rdPartyServiceHandlers/pv_live');
const meteo_stat = require('../3rdPartyServiceHandlers/meteo_stat');
const trainingData = require('../Data/trainingData');
const Update = require('../Data/update');
const Region = require('../Data/region');


async function run() {
    try {
        // get latest update and set date range for data
        const latest = await Update.findOne().sort({ timeStamp: -1 });
        var start = latest ? latest.timeStamp : new Date(process.env.DATA_START_DATE);
        var end = new Date(Date.now());

        // get regions
        var regions = await Region.find().exec();
        let data = [];
        
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            // get data
            let solarData = await PV_Live.getData(start.toISOString(), end.toISOString(), region.codes.pv_live).then();
            let weatherData = await meteo_stat.getData(Math.floor(start.getTime() / 1000), Math.floor(end.getTime() / 1000), region.codes.meteo_stat);
            // merge data
            let mergedData = mergeDatasets(weatherData, solarData, region);
            data.push(...mergedData); 
        }

        // insert data into db
        await trainingData.insertMany(data);

        // create new update
        await new Update({ timeStamp: end }).save();

    } catch (error) {
        console.log(error);
    }
}

function mergeDatasets(weatherData, solarData, region) {
    let dataset = [];
    
    weatherData.forEach((element) => {
        let solarPoint = solarData.find(x => x.time.getTime() === element.time.getTime());

        let newData = {
            solarMW:solarPoint != null ? solarPoint.outputMW : 0, 
            ...element,
            region:region
        }
        dataset.push(newData);
    });

    return dataset;


}

module.exports = run;