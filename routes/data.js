const trainingData = require('../Data/trainingData');
const Forecast = require('../Data/forecast');
const Region = require('../Data/region');
const router = require('express').Router();

function getData(req, res){
    trainingData.find().select("-__v -_id").populate('region').catch(err => {console.log(err)}).then(data =>{
        
        res.send(data);
    });
}

function getForecastData(req, res){
    Forecast.find().select("-__v -_id").populate('region').then(data =>{
        res.send(data);
    });

}

router.get('/', getData);
router.get('/forecast', getForecastData);

module.exports = {
    router,
    getData,
    getForecastData
};
