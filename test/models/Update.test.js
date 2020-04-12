const sinon = require('sinon');
const assert = require('chai').assert;
const sandbox = sinon.createSandbox();

const modelFactories = require('../testDataFactories/modelFactories');

const Update = require('../../Data/update');
const mongoose = require('mongoose');

describe('Update model tests',()=>{
    describe('#getLatestUpdateByRegion()',()=>{
        let validUpdates = modelFactories.validUpdate();

        beforeEach(()=>{
            sandbox.stub(Update,'aggregate').resolves(validUpdates);
        });
        afterEach(()=>{
            sandbox.reset();
            sandbox.resetHistory();
            sandbox.restore();
        });
        it('Gets valid data',async ()=>{
            let result = await await Update.getLatestUpdateByRegion();

            assert.deepEqual(result, validUpdates);
            sandbox.assert.calledOnce(Update.aggregate);

        });
    });
});
