const ObjectId = require('mongoose').Types.ObjectId;

//#region  Update model
module.exports.validUpdate = () => {
    return {
        timeStamp: new Date('2020-01-28T12:00:00.000Z'),
        region: 'testId'
    };
};
//#endregion

//#region Region model
const Region = require('../../Data/region');

module.exports.validRegions = () => {
    
    let regions = [
        new Region({
           
            "name": "South Western England",
            "regionCode": 22,
            "codes": {
                "pv_live": 22,
                "meteo_stat": "03839",
                "coords": [50.733997064, -3.4083317]
            }
        }),
        new Region({
            "name": "Southern England",
            "regionCode": 20,
            "codes": {
                "pv_live": 20,
                "meteo_stat": "03865",
                "coords": [51.0598, -1.3101]
            }
        })
    ];
    regions[0]._id = new ObjectId('5e8f413ee32fef21248465f3')
    regions[1]._id = new ObjectId('5e8f413ee32fef21248465f4')
    return regions;
};
//#endregion

//#region trainingData model
module.exports.validTrainingDatas = (regions) => {
    return [
        {
          solarMW: 921.3,
          time: new Date('2020-02-07T17:00:00.000Z'),
          temperature: 10.2,
          windspeed: 22.2,
          condition: 4,
          region: regions[0]
        },
        {
          solarMW: 921.3,
          time: new Date('2020-02-07T17:00:00.000Z'),
          temperature: 10.2,
          windspeed: 22.2,
          condition: 4,
          region: regions[1]
          
        }
      ];
};
//#endregion

//#region Forecast Model
module.exports.validForecastData = (regions) => {
    return [
        {
          time: new Date('2020-02-07T17:00:00.000Z'),
          temperature: 10.2,
          windspeed: 22.2,
          condition: 4,
          region: regions[0]
        },
        {
          time: new Date('2020-02-07T17:00:00.000Z'),
          temperature: 10.2,
          windspeed: 22.2,
          condition: 4,
          region: regions[1]
          
        }
      ];

};

//#endregion 