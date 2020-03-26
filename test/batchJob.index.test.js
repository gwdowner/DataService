const sinon = require('sinon');
const sandbox = sinon.createSandbox();

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
    describe('#batchJob', () => {
        let rawData = [
            [0, "2020-01-27T00:00:00Z", 0.000705],
            [0, "2020-01-27T00:30:00Z", 0.0]
        ];
        let formattedData = [
            { region: 0, time: new Date(1580083200000), outputMW: 0.000705 },
            { region: 0, time: new Date(1580085000000), outputMW: 0 }
        ];

        let formattedWeatherData = [
            {
                time: new Date('2020-02-07T17:00:00.000Z'),
                temperature: 10.2,
                windspeed: 22.2,
                condition: 4
            }
        ];

        let regions = [{
            name: 'Sout west (SW)',
            codes: {
                pv_live: '22',
                meteo_stat: '03839'
            }
        }];

        let latest = new Update({ timeStamp: new Date('2020-01-28T12:00:00.000Z') });

        let mockFindOne = {
        }

        beforeEach(() => {
            sandbox.stub(meteo_stat, 'getData').returns(formattedWeatherData);

            sandbox.stub(Region, 'find').returns({ exec: () => { return regions; } });
            sandbox.stub(trainingData, 'insertMany').resolves({});
            sandbox.stub(Forecast, 'deleteMany').resolves({});
            sandbox.stub(Forecast, 'exists').returns(false);
            sandbox.stub(Forecast.prototype, 'save').returns({});
            sandbox.stub(PV_Live, 'getData').resolves(formattedData);
            sandbox.stub(met_office, 'getData').resolves(formattedData);
            sandbox.stub(Update, 'findOne').returns(mockFindOne);
            sandbox.stub(Update.prototype, 'save').returns();
            sandbox.stub(console, 'log').returns();
            mockFindOne.sort = sandbox.spy(() => {
                return latest;
            });
        });

        afterEach(() => {
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('All valid data', async () => {

            await batchJob();
            sandbox.assert.calledOnce(Update.findOne);
            sandbox.assert.calledOnce(mockFindOne.sort);
            sandbox.assert.calledOnce(PV_Live.getData);
            sandbox.assert.calledOnce(trainingData.insertMany);
            sandbox.assert.calledOnce(Update.prototype.save);

        });

        it('Error thrown with connections, error handdled', async () => {
            // set the method to throw an error
            PV_Live.getData.restore();
            sandbox.stub(PV_Live, 'getData').throws('Error: Some error thrown');

            await batchJob();

            sandbox.assert.calledOnce(Update.findOne);
            sandbox.assert.calledOnce(mockFindOne.sort);
            sandbox.assert.calledOnce(PV_Live.getData);
            sandbox.assert.calledOnce(console.log);
        });


        it('first time no updates in db', async () => {
            mockFindOne.sort = sandbox.spy(() => {
                return null;
            });
            await batchJob();
            sandbox.assert.calledOnce(Update.findOne);
            sandbox.assert.calledOnce(mockFindOne.sort);
            sandbox.assert.calledOnce(PV_Live.getData);
            sandbox.assert.calledOnce(trainingData.insertMany);
            sandbox.assert.calledOnce(Update.prototype.save);

        });
    });
});