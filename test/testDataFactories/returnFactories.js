const moment = require('moment');

//#region Meteostat data
module.exports.formattedMeteostatData = () => {
    return [
        {
            time: new Date('2020-02-07T17:00:00.000Z'),
            temperature: 10.2,
            windspeed: 22.2,
            condition: 4
        }
    ];
};
//#endregion

//#region PV live data 
module.exports.formattedPvliveData = () => {
    return [
        {
            region: 22,
            time: new Date('2020-02-07T17:00:00.000Z'),
            outputMW: 921.3
        },
        {
            region: 22,
            time: new Date('2020-02-07T18:00:00.000Z'),
            outputMW: 1
        }
    ];
}

module.exports.formattedPvliveDataHalfHourly = () => {
    return [{
        "outputMW": 721.3,
        "region": 22,
        "time": new Date('2020-02-07T17:00:00.000Z')
    },
    {
        "outputMW": 200,
        "region": 22,
        "time": new Date('2020-02-07T17:30:00.000Z')
    },
    {
        "outputMW": 1,
        "region": 22,
        "time": new Date('2020-02-07T18:00:00.000Z')
    }];
}

module.exports.validTimeFrames = () => {
    return [
        {
            start: new moment('2018-02-07T17:30:00.000Z'),
            end: new moment('2019-02-07T17:30:00.000Z')
        },
        {
            start: new moment('2019-02-07T17:30:00.000Z'),
            end: new moment('2020-02-07T17:30:00.000Z')
        },
        {
            start: new moment('2020-02-07T17:30:00.000Z'),
            end: new moment('2020-03-07T17:30:00.000Z')
        }
    ]
};
//#endregion