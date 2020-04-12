const assert = require('chai').assert;
const sandbox = require('sinon').createSandbox();

const meteo_stat = require('../3rdPartyServiceHandlers/meteo_stat');

const axios = require('axios');

describe('Meteo stat service handler tests', () => {
    let rawData = [{
        time: '2020-02-09 14:00:00',
        temperature: 14,
        dewpoint: 11,
        humidity: 82,
        precipitation: 2.1,
        precipitation_3: null,
        precipitation_6: null,
        snowdepth: null,
        windspeed: 48,
        peakgust: 85.2,
        winddirection: 230,
        pressure: 989,
        condition: 8
    },
    {
        time: '2020-02-09 15:00:00',
        temperature: 10,
        dewpoint: 9.1,
        humidity: 94,
        precipitation: 0.7,
        precipitation_3: 1.7,
        precipitation_6: null,
        snowdepth: null,
        windspeed: 52,
        peakgust: 87,
        winddirection: 250,
        pressure: 990,
        condition: 9
    },
    {
        time: '2020-02-09 16:00:00',
        temperature: 13,
        dewpoint: 11.1,
        humidity: 88,
        precipitation: 4,
        precipitation_3: null,
        precipitation_6: null,
        snowdepth: null,
        windspeed: 48,
        peakgust: 90.8,
        winddirection: 240,
        pressure: 989,
        condition: 8
    }
    ];
    let formattedWeatherData = [
        {
            "condition": 8,
            "temperature": 14,
            "time": new Date('2020-02-09T14:00:00.000Z'),
            "windspeed": 48,
        },
        {
            "condition": 9,
            "temperature": 10,
            "time": new Date('2020-02-09T15:00:00.000Z'),
            "windspeed": 52
        },
        {
            "condition": 8,
            "temperature": 13,
            "time": new Date('2020-02-09T16:00:00.000Z'),
            "windspeed": 48
        }
    ];

    let getRes = { data: { data: rawData }, status: 200 };

    beforeEach(() => {
        sandbox.stub(axios, 'get').resolves(getRes);
    });

    describe('#parseWeatherData()', () => {
        it('Parses correctly with valid data', () => {
            var result = meteo_stat.parseWeatherData(rawData);
            assert.deepEqual(result, formattedWeatherData, 'expected formatted data does not match');

        });
    });

    describe("#getData", () => {
        it("valid start and end", async () => {
            let result = await meteo_stat.getData("2020-01-28T12:00:00.000Z", "2020-01-30T15:24:53.815Z", '30');
            sandbox.assert.calledOnce(axios.get);
            assert.deepEqual(result, formattedWeatherData, "expected expected weather data returned");
        });

        it('GET request fails', async () => {
            getRes.status = 404;
            let result = await meteo_stat.getData("2020-01-28T12:00:00.000Z", "2020-01-30T15:24:53.815Z", '30');
            assert.deepEqual(result, [], 'empty array not returned when request fails');
        });
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.resetHistory();
        sandbox.restore();
    });
});