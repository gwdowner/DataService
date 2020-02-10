const axios = require('axios');

async function getData(start, end, station) {
    return axios
        .get(`${process.env.PROVIDER_METSTAT}/history/hourly?station=${station}&start=${start}&end=${end}&key=${process.env.PROVIDER_METSTAT_APIKEY}`)
        .then(res => {
            if (res.status == 200) {

                let data = parseWeatherData(res.data.data);
                // filter out data so we only have data on the hour
                let filteredData = data.filter(x => x.time.getMinutes() == 0);

                return filteredData;
            } else {
                return [];
            }

        }).catch(err => {
        });

}

function parseWeatherData(rawData) {
    let formatedData = [];

    rawData.forEach(element => {
        formatedData.push({
            time: new Date(element.time),
            temperature: element.temperature,
            windspeed: element.windspeed,
            condition: element.condition
        });
    });

    return formatedData;
}

module.exports = {
    getData,
    parseWeatherData
}