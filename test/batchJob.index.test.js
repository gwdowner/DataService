const sinon = require('sinon');
const assert = require('chai').assert;
const sandbox = sinon.createSandbox();
const returnFactories = require('./testDataFactories/returnFactories');
const apiFactories = require('./testDataFactories/apiFactories');
const modelFactories = require('./testDataFactories/modelFactories');
const batchJob = require('../BatchJobs/index');

const PV_Live = require('../3rdPartyServiceHandlers/pv_live');
const meteo_stat = require('../3rdPartyServiceHandlers/meteo_stat');
const met_office = require('../3rdPartyServiceHandlers/met_office')
const trainingData = require('../Data/trainingData');
const Update = require('../Data/update');
const Region = require('../Data/region');
const Forecast = require('../Data/forecast');

process.env.DATA_START_DATE = '2020-01-28T12:00:00.000Z'

describe('batch job index tests', () => {
    describe('#runHistJob()', () => {
        let rawData = apiFactories.pvliveValidHistoric();
        let formattedData = returnFactories.formattedPvliveData();
        let formattedWeatherData = returnFactories.formattedMeteostatData();
        let regions = modelFactories.validRegions();
        let latest = new Update(modelFactories.validUpdate());
        let mockFindOne = {
        }
        let latestUpdate = [
            { _id: '5e8f413ee32fef21248465f4', time: new Date('2020-04-10T12:50:03.594Z') },
            { _id: '5e8f413ee32fef21248465f3', time: new Date('2020-04-10T12:50:02.895Z') }
        ];

        beforeEach(() => {
            sandbox.stub(meteo_stat, 'getData').returns(formattedWeatherData);
            sandbox.stub(Region, 'find').resolves(regions);
            sandbox.stub(trainingData, 'insertMany').resolves({});
            sandbox.stub(Forecast, 'deleteMany').resolves({});
            sandbox.stub(Forecast, 'exists').returns(false);
            sandbox.stub(Forecast.prototype, 'save').returns({});
            sandbox.stub(PV_Live, 'getData').resolves(formattedData);
            sandbox.stub(met_office, 'getData').resolves(formattedData);
            sandbox.stub(Update, 'findOne').returns(mockFindOne);
            sandbox.stub(Update.prototype, 'save').returns();
            sandbox.stub(Update, 'getLatestUpdateByRegion').returns(latestUpdate);
            sandbox.stub(console, 'log').returns();

        });

        afterEach(() => {
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('All valid data', async () => {
            console.log('in valid data');
            await batchJob.runHistJob();

            sandbox.assert.calledTwice(PV_Live.getData);
            sandbox.assert.calledOnce(trainingData.insertMany);
            sandbox.assert.calledTwice(Update.prototype.save);
            assert.deepEqual(trainingData.insertMany.args[0][0], modelFactories.validTrainingDatas(regions));
        });

        it('Error thrown with connections, error handdled', async () => {
            // set the method to throw an error
            let error = 'Error: Some error thrown';
            PV_Live.getData.restore();
            sandbox.stub(PV_Live, 'getData').throws(error);


            await batchJob.runHistJob();
            sandbox.assert.calledOnce(PV_Live.getData);
            //sandbox.assert.calledWith(console.log, );
            assert.equal(console.log.getCall(-1).args[0], error);
        });


        it('first time no updates in db', async () => {

            await batchJob.runHistJob();
            //sandbox.assert.calledOnce(Update.findOne);

            sandbox.assert.calledTwice(PV_Live.getData);
            sandbox.assert.calledTwice(Update.prototype.save);
            sandbox.assert.calledOnce(trainingData.insertMany);
            assert.deepEqual(trainingData.insertMany.args[0][0], modelFactories.validTrainingDatas(regions));
        });
    });

    describe('#runForecastJob', () => {
        const validRegions = modelFactories.validRegions();
        const validForecast = modelFactories.validForecastData(validRegions);

        beforeEach(() => {
            sandbox.stub(Region, 'find').resolves(validRegions);
            sandbox
                .stub(met_office, 'getData')
                .onCall(0).resolves([validForecast[0]])
                .onCall(1).resolves([validForecast[1]]);
            sandbox.stub(Forecast, 'deleteMany').resolves({});
            sandbox.stub(Forecast, 'exists')
                .onCall(0).resolves(true)
                .onCall(1).resolves(false);
            sandbox.stub(Forecast.prototype, 'save').returns({});
            sandbox.stub(Forecast,'updateOne').resolves({});
        });
        afterEach(() => {
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('Gets valid forecast + adds to DB', async () => {
            await batchJob.runForecastJob();
            sandbox.assert.calledOnce(Forecast.prototype.save);
            sandbox.assert.calledOnce(Forecast.updateOne); 
        });

    });
});