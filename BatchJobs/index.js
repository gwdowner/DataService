const PV_Live = require('../3rdPartyServiceHandlers/pv_live');
const meteo_stat = require('../3rdPartyServiceHandlers/meteo_stat');
const met_office = require('../3rdPartyServiceHandlers/met_office');
const trainingData = require('../Data/trainingData');
const Update = require('../Data/update');
const Region = require('../Data/region');
const Forecast = require('../Data/forecast');

async function runForecastJob() {
    let regions = await Region.find().then();;
    let latestForecast = [];
    for (let region of regions) {
        let forecastData = await met_office.getData(region).then();
        console.log('Found Metoffice data');
        latestForecast.push(...forecastData);
    }

    await cleanForecastData(latestForecast);
}

async function runHistJob() {
    try {

        let latestUpdateByRegion = await Update.getLatestUpdateByRegion();
        let regions = await Region.find().then();
        let data = [];

        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            console.log(`Region = ${region.name}`);

            // get latest update and set date range for data
            const latest = latestUpdateByRegion.find(x => region._id.toString() == x._id);

            var start = latest ? latest.time : new Date(process.env.DATA_START_DATE);
            var end = new Date(Date.now());

            // get data
            let solarData = await PV_Live.getData(start.toISOString(), end.toISOString(), region.codes.pv_live).then();
            console.log('after pv data');
            let weatherData = await meteo_stat.getData(Math.floor(start.getTime() / 1000), Math.floor(end.getTime() / 1000), region.codes.meteo_stat);
            console.log('after weather data');

            // merge data
            let mergedData = mergeDatasets(weatherData, solarData, region);
            data.push(...mergedData);
            // create new update
            await new Update({ timeStamp: end, region: region }).save();
        }

        console.log(`inserting ${data.length} entries`);
        // insert data into db
        await trainingData.insertMany(data);

    } catch (error) {
        console.log(error);
    }
}

function mergeDatasets(weatherData, solarData, region) {
    let dataset = [];
    for(let element of weatherData){
        let solarPoint = solarData.find(x => x.time.getTime() === element.time.getTime());
        if (solarData) {
            let newData = {
                solarMW: solarPoint != null ? solarPoint.outputMW : 0,
                ...element,
                region: region
            }
            dataset.push(newData);
        }
    }

    return dataset;
}

async function cleanForecastData(latestForecast) {
    await Forecast
        .deleteMany({
            time: {
                $lt: new Date()
            }
        }).then();

    for (const f of latestForecast) {
        let query = {
            time: {
                $eq: f.time.toISOString()
            },
            region: {
                $eq: f.region
            }
        };
        let exists = await Forecast.exists(query);
        if (exists) {
            await Forecast.updateOne(query, f).then();
        } else {
            await new Forecast(f).save();
        }
    }
}

module.exports = {
    runHistJob,
    runForecastJob
};