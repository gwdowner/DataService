const trainingData = require('../Data/trainingData');
const router = require('express').Router();

function getData(req, res){
    trainingData.find().select("-__v -_id -region").then(data =>{
        res.send(data);
    });
}

router.get('/', getData);

module.exports = {
    router,
    getData
};
