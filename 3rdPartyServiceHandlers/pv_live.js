const axios = require('axios');

async function getData(start, end){
    console.log(process.env.PROVIDER_PVL+'?start='+start+'&end='+end);
    return axios
        .get(process.env.PROVIDER_PVL+'?start='+start+'&end='+end)
        .then(res => {
            console.log('In solar data');
            return res.data.data;
        })
        .catch();
}

function rawDataToSolarData(rawData){
    var solarFormatted = [];

    rawData.forEach(data => {
        solarFormatted.push({
            region:data[0],
            time:Date.parse(data[1]),
            outputMW:data[2]
        });
    });
    return solarFormatted;
}

module.exports = {
    getData,
    rawDataToSolarData
};