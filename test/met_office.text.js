const assert = require('chai').assert;
const sandbox = require('sinon').createSandbox();

const met_office = require('../3rdPartyServiceHandlers/met_office');

const axios = require('axios');



describe('met Office service handler tests', () => {


    beforeEach(() => {
        sandbox.stub(axios, 'get').resolves({ data: rawData, status: 200 });
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.resetHistory();
        sandbox.restore();
    });

    describe('#getData', () => {
        it('valid region gets data and formats', async () => {
            let result = await met_office.getData(region).then();
            assert.deepEqual(result, formattedData, "expected raw data not returned");
        });
    })

});

const region = {
    codes: {
        coords: [1, 1]
    }
}

const formattedData = [
    {
        time: new Date('2020-03-26T14:00:00.000Z'),
        region: region,
        temperature: 13.12,
        windspeed: 6.22,
        condition: 1
    },
    {
        time: new Date('2020-03-26T15:00:00.000Z'),
        region: region,
        temperature: 13.26,
        windspeed: 5.76,
        condition: 1
    },
    {
        time: new Date('2020-03-26T16:00:00.000Z'),
        region: region,
        temperature: 11.56,
        windspeed: 3.29,
        condition: 1
    },
    {
        time: new Date('2020-03-26T17:00:00.000Z'),
        region: region,
        temperature: 10.82,
        windspeed: 1.85,
        condition: 1
    }];


const rawData = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        properties: {
            timeSeries: [{
                time: '2020-03-26T14:00Z',
                screenTemperature: 13.12,
                maxScreenAirTemp: 13.123175,
                minScreenAirTemp: 13.119997,
                screenDewPointTemperature: -3.72,
                feelsLikeTemperature: 10.1,
                windSpeed10m: 6.22,
                windDirectionFrom10m: 68,
                windGustSpeed10m: 7.72,
                max10mWindGust: 8.159108,
                visibility: 22318,
                screenRelativeHumidity: 30.52,
                mslp: 102150,
                uvIndex: 3,
                significantWeatherCode: 1,
                precipitationRate: 0,
                totalPrecipAmount: 0,
                totalSnowAmount: 0,
                probOfPrecipitation: 0
            },
            {
                time: '2020-03-26T15:00Z',
                screenTemperature: 13.26,
                maxScreenAirTemp: 13.340348,
                minScreenAirTemp: 13.217748,
                screenDewPointTemperature: -2.37,
                feelsLikeTemperature: 10.43,
                windSpeed10m: 5.76,
                windDirectionFrom10m: 67,
                windGustSpeed10m: 7.72,
                max10mWindGust: 7.8830633,
                visibility: 20450,
                screenRelativeHumidity: 33.4,
                mslp: 102180,
                uvIndex: 2,
                significantWeatherCode: 1,
                precipitationRate: 0,
                totalPrecipAmount: 0,
                totalSnowAmount: 0,
                probOfPrecipitation: 0
            },
            {
                time: '2020-03-26T16:00Z',
                screenTemperature: 11.56,
                maxScreenAirTemp: 11.605048,
                minScreenAirTemp: 11.518823,
                screenDewPointTemperature: 0.97,
                feelsLikeTemperature: 9.95,
                windSpeed10m: 3.29,
                windDirectionFrom10m: 144,
                windGustSpeed10m: 3.95,
                max10mWindGust: 5.9959936,
                visibility: 14172,
                screenRelativeHumidity: 47.52,
                mslp: 102190,
                uvIndex: 2,
                significantWeatherCode: 1,
                precipitationRate: 0,
                totalPrecipAmount: 0,
                totalSnowAmount: 0,
                probOfPrecipitation: 0
            },
            {
                time: '2020-03-26T17:00Z',
                screenTemperature: 10.82,
                maxScreenAirTemp: 10.931691,
                minScreenAirTemp: 10.794602,
                screenDewPointTemperature: 2.08,
                feelsLikeTemperature: 10.13,
                windSpeed10m: 1.85,
                windDirectionFrom10m: 180,
                windGustSpeed10m: 2.22,
                max10mWindGust: 5.5403266,
                visibility: 13596,
                screenRelativeHumidity: 54.05,
                mslp: 102180,
                uvIndex: 1,
                significantWeatherCode: 1,
                precipitationRate: 0,
                totalPrecipAmount: 0,
                totalSnowAmount: 0,
                probOfPrecipitation: 0
            }]
        }
    }]
};