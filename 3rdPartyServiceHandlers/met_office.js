const axios = require('axios');

const headers = {
    'accept': 'application/json',
    'x-ibm-client-id': process.env.PROVIDER_METOFFICE_CLIENTID,
    'x-ibm-client-secret': process.env.PROVIDER_METOFFICE_SECRET
};

async function getData(region) {
    let coords = region.codes.coords;
    return await axios
        .get(`${process.env.PROVIDER_METOFFICE}/forecasts/point/hourly?latitude=${coords[0]}&longitude=${coords[1]}`,
            { headers })
        .then(res => {
            
            if (res.status === 200) {
                return formatMetofficeData(res.data, region);
            } else {
                return [];
            }
        })
        .catch(e => { });
}

function formatMetofficeData(data, region) {
    let formattedData = [];
    let features = data.features[0].properties.timeSeries;

    for (var x of features) {
        let tempFeature = {
            time: new Date(x.time),
            region: region,
            temperature: x.screenTemperature,
            windspeed: x.windSpeed10m,
            condition: x.significantWeatherCode
        };
        formattedData.push(tempFeature);
    }

    return formattedData;
}

module.exports = {
    getData
}