const assert = require('chai').assert;
const sandbox = require('sinon').createSandbox();
const apiFactories = require('./testDataFactories/apiFactories');
const returnFactories = require('./testDataFactories/returnFactories');
const pv_live = require('../3rdPartyServiceHandlers/pv_live');

const axios = require('axios');

describe('PV Live service handler tests', () => {
    let rawData = apiFactories.pvliveValidHistoric()[0];
    let formattedDataCondesed = returnFactories.formattedPvliveData();
    let formattedDataHalfHourly = returnFactories.formattedPvliveDataHalfHourly();


    describe('#rawDataToSolarData()', () => {
        it('Valid conversion from raw data format to JSON PV data', () => {
            var result = pv_live.rawDataToSolarData(rawData);
            assert.deepEqual(result, formattedDataHalfHourly, 'Returned data does not match expected output');
        });
    });

    describe("#getData", () => {
        beforeEach(() => {
            sandbox.stub(axios, 'get').resolves({ data: { data: rawData } });
        });

        afterEach(() => {
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });

        it("valid start and end", async () => {
            let result = await pv_live.getData("2020-01-28T12:00:00.000Z", "2020-01-30T15:24:53.815Z");
            sandbox.assert.calledOnce(axios.get);
            assert.deepEqual(result, formattedDataCondesed, "expected raw data not returned");
        });
    });

    describe('#getDataHourly()', () => {
        it('Merges half hourly data to hourly', () => {
            let result = pv_live.getDataHourly(formattedDataHalfHourly);
            assert.deepEqual(result, formattedDataCondesed);
        });
    });
    describe('#sumData()', () => {
        it('Given array of data sums the data and returns one valid object', () => {
            let result = pv_live.sumData(formattedDataHalfHourly.slice(0, 2));
            assert.deepEqual(result, { outputMW: 921.3 });
        });
    });
    describe('#getRegions()', () => {
        beforeEach(() => {
            sandbox.stub(axios, 'get')
                .resolves(
                    {
                        data: apiFactories.pvLiveRawValidRegional(),
                        status: 200
                    });
        });

        afterEach(() => {
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('Makes cal to PV live and returns data converted to JSON', async () => {
            let result = await pv_live.getRegions().then();
            assert.deepEqual(result, apiFactories.pvliveValidRegional());
        });

        it('Tries to make call to PV_live, error thrown and handled', async () => {
            axios.get.restore();
            sandbox.stub(axios, 'get').rejects('some error');
            let result = await pv_live.getRegions().then();
            assert.deepEqual(result, []);

        });
    });

    describe('#getTimeFrames()', () => {

        it('Given a valid start and end dates, yearly timeframes should be returned', () => {
            let expected = returnFactories.validTimeFrames();
            let result = pv_live.getTimeFrames('2018-02-07T17:30:00.000Z', '2020-03-07T17:30:00.000Z');
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                assert.equal(result[i].start.format(), expected[i].start.format(), 'START');
                assert.equal(result[i].end.format(), expected[i].end.format(), 'END');
            }


        });
    });
});