const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = require('chai').assert;

const data = require('../../routes/data');

const trainingData = require('../../Data/trainingData');


describe('Data router tests', () => {
    let req = {

    };
    let res = {
        send: sandbox.spy((data)=>{res})
    };

   
    let formattedData = [
        {
            solarMW: 325.12987,
            temperature: 4,
            windspeed: 11.2,
            condition: 3,
            time: new Date('2020-01-28T12:00:00.000Z')
          },
          {
            solarMW: 818.72826,
            temperature: 4,
            windspeed: 38.9,
            condition: 17,
            time: new Date( '2020-01-28T13:00:00.000Z')
          },
          {
            solarMW: 879.5980400000001,
            temperature: 6,
            windspeed: 20.5,
            condition: 17,
            time: new Date( 'y2020-01-28T14:00:00.000Z')
          }

    ];

    let findMock = {
        select:sandbox.stub().resolves(formattedData)
    }


    describe('GET: /', () => {
        beforeEach(() => {
            sandbox.stub(trainingData, 'find').returns(findMock);
        });

        afterEach(() => {
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });

        it('Returns corrcect data', async () => {

            let result = await data.getData(req, res);

            assert.isTrue(res.send.calledOnceWith(formattedData), 'Send not called once with the data returned from DB');

        });

    });
});