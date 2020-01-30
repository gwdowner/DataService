const assert = require('chai').assert;
const sandbox = require('sinon').createSandbox();

const batchJob = require('../BatchJobs/index');

const PV_Live = require('../3rdPartyServiceHandlers/pv_live');
const SolarData = require('../Data/solarData');

describe('batch job index tests', () => {
    let rawData = [
        [0, "2020-01-27T00:00:00Z", 0.000705],
        [0, "2020-01-27T00:30:00Z", 0.0]
    ];
    let formattedData = [
        { region: 0, time: 1580083200000, outputMW: 0.000705 },
        { region: 0, time: 1580085000000, outputMW: 0 }
    ];

    beforeEach(() => {
        sandbox.stub(SolarData, 'insertMany').resolves({});
        sandbox.stub(PV_Live, 'getData').resolves(rawData);
        sandbox.stub(PV_Live, 'rawDataToSolarData').returns(formattedData);

    });

    afterEach(() => {
        sandbox.reset();
        sandbox.resetHistory();
        sandbox.restore();
    });

    it('#batchJob', async ()=> {
        await batchJob();
        sandbox.assert.calledOnce(PV_Live.getData);
        sandbox.assert.calledOnce(PV_Live.rawDataToSolarData);
        sandbox.assert.calledOnce(SolarData.insertMany);
    });
});