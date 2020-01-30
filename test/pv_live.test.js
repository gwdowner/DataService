const assert = require('chai').assert;
const sandbox = require('sinon').createSandbox;

const pv_live = require('../3rdPartyServiceHandlers/pv_live');

describe('PV Live service handler tests', () => {
    let rawData = [
        [0, "2020-01-27T00:00:00Z", 0.000705],
        [0, "2020-01-27T00:30:00Z", 0.0]
    ];
    let formattedData = [
        { region: 0, time: 1580083200000, outputMW: 0.000705 },
        { region: 0, time: 1580085000000, outputMW: 0 }
    ];

    describe('#rawDataToSolarData()', () => {
        it('valid dataset', () => {
            var result = pv_live.rawDataToSolarData(rawData);
            assert.deepEqual(result, formattedData, 'Returned data does not match expected output');
        })
    });
});