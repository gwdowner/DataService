const trainingData = require('../Data/trainingData');
const Forecast = require('../Data/forecast');
const Region = require('../Data/region');
const router = require('express').Router();
const pv_live = require('../3rdPartyServiceHandlers/pv_live');
const serverStrings = require('../strings/serverStrings');
async function getData(req, res) {
    await trainingData
        .find()
        .select("-__v -_id")
        .populate('region')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .send(serverStrings.internal_server_error);
        });
}

async function getForecastData(req, res) {
    await Forecast
        .find()
        .select("-__v -_id")
        .populate('region')
        .then(data => {
            res.send(data);
        }).catch(err => {
            console.log(err)
            res
                .status(500)
                .send(serverStrings.internal_server_error);
        });
}

async function getRegions(req, res) {
    await pv_live
        .getRegions()
        .then(data => {
            res.send(data);
        }).catch(err => {
            console.log(err);
            res.status(500).send(serverStrings.internal_server_error);
        })


}

router.get('/', getData);
router.get('/forecast', getForecastData);
router.get('/regions', getRegions);

module.exports = {
    router,
    getData,
    getForecastData,
    getRegions
};
