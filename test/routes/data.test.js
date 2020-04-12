const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = require('chai').assert;
const mongoose = require('mongoose');
const modelFactories = require('../testDataFactories/modelFactories');
const apiFactories = require('../testDataFactories/apiFactories');
const routerFactories = require('../testDataFactories/routerFactories');
const data = require('../../routes/data');
const pv_live = require('../../3rdPartyServiceHandlers/pv_live');
const serverStrings = require('../../strings/serverStrings');

describe('Data router tests', () => {
    let expectedResponse = modelFactories.validTrainingDatas(modelFactories.validRegions());
    let {req, res} = routerFactories.reqres(sandbox);
    

    describe('GET: /forecastdata', () => {
        let validForecast = modelFactories.validForecastData(modelFactories.validRegions());

        beforeEach(() => {
            sandbox.stub(mongoose.Query.prototype, 'populate').resolves(validForecast);
        });

        afterEach(() => {
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('Returns correct data', async () => {
            let result = await data.getForecastData(req, res);
            assert.isTrue(res.send.calledOnceWith(validForecast), 'Send not called once with the data returned from DB');
        });

        it('Error when calling PV_live handles gracefully', async () => {
            mongoose.Query.prototype.populate.restore();
            sandbox.stub(mongoose.Query.prototype, 'populate')
                .rejects('some error');
            await data.getForecastData(req, res);
            assert.deepEqual(res.send.getCall(-1).args[0], serverStrings.internal_server_error);
        });

    });

    describe('GET: /', () => {
        beforeEach(() => {
            sandbox.stub(mongoose.Query.prototype, 'populate').resolves(expectedResponse);
        });

        afterEach(() => {
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('Has error in DB read handles gracefully', async () => {
            mongoose.Query.prototype.populate.restore();
            sandbox.stub(mongoose.Query.prototype, 'populate').rejects('some error');

            let result = await data.getData(req, res);
            assert.deepEqual(res.send.getCall(-1).args[0], serverStrings.internal_server_error);
        });

        it('Returns valid training data', async () => {
            let result = await data.getData(req, res);
            assert.equal(res.send.getCall(-1).args[0], expectedResponse);
        });

    });

    describe('GET: /regions', () => {
        let validPvRegions = apiFactories.pvliveValidRegional();
        beforeEach(() => {
            sandbox.stub(pv_live, 'getRegions')
                .resolves(validPvRegions);
        });
        afterEach(() => {
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('Returns valid regions', async () => {
            await data.getRegions(req, res);
            assert.deepEqual(res.send.getCall(-1).args[0], validPvRegions);
        });

        it('Error when calling PV_live handles gracefully', async () => {
            pv_live.getRegions.restore();
            sandbox
                .stub(pv_live, 'getRegions').rejects('some error');
            await data.getRegions(req, res);
            assert.deepEqual(res.send.getCall(-1).args[0], serverStrings.internal_server_error);

        });
    });
});