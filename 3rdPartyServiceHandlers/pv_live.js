const axios = require('axios');
const moment = require('moment');
const ONE_HOUR = 1000 * 60 * 60;

async function getData(start, end, pes) {
    // get timeframe
    let timeFrames = getTimeFrames(start, end);
    // split into manageable chunks
    let splitEndpoints = timeFrames.map(x =>
        axios.get(`${process.env.PROVIDER_PVL}/pes/${pes}?start=${x.start.format()}&end=${x.end.format()}`));

    return axios
        .all(splitEndpoints)
        .then(axios.spread((...responses) => {
            console.log('got responses');
            allData = responses.map(x => {
                return x.data.data;
            });
            condensedData = allData.flat(1);
            let data = rawDataToSolarData(condensedData);
            return getDataHourly(data);

        }))
        .catch(e => {
            console.log(e);
        });
}

function rawDataToSolarData(rawData) {
    var solarFormatted = [];

    rawData.forEach(data => {

        solarFormatted.push({
            region: data[0],
            time: new Date(data[1]),
            outputMW: data[2]
        });
    });
    return solarFormatted;
}

function findLast(array, condition) {
    for (let i = array.length - 1; i >= 0; i--) {
        let element = array[i];
        if (condition(element)) {
            return element;
        }
    }
    return null;
}

function getDataHourly(data) {
    console.log('reducing dataset hourly');
    let reducedDataset = data.reduce((accum, x, index) => {

        let hour = new moment(x.time).startOf('hour');

        if (moment(x.time).minutes() !== 0) {
            // add to existing
            let existingElement = findLast(accum, i => {
                return new moment(i.time).isSame(hour);
            });
            if (existingElement) {
                let output = x.outputMW ? x.outputMW : 0;
                existingElement.outputMW += output;
            } else {
                let output = x.outputMW ? x.outputMW : 0;
                accum.push({
                    time: x.time,
                    region: x.region,
                    outputMW: output
                });
            }
        } else {
            // add to new
            let output = x.outputMW ? x.outputMW : 0;
            accum.push({
                time: x.time,
                region: x.region,
                outputMW: output
            });
        }
        return accum;
    }, []);
    return reducedDataset;
}

function sumData(data) {
    let finalObj = {
        outputMW: 0
    }

    data.forEach(element => {
        finalObj.outputMW += element.outputMW;
    });

    return finalObj;
}

function getTimeFrames(start, end) {

    let timeFrames = [];

    let timeFrame = new moment.duration(new moment(end).diff(new moment(start))).years();
    var tmpStart = new moment(start);
    var tmpEnd = new moment(end);

    for (let i = 0; i < timeFrame; i++) {
        tmpEnd = new moment(tmpStart).add(1, 'year');
        let newTimeframe = {
            start: tmpStart,
            end: tmpEnd
        }
        timeFrames.push(newTimeframe);
        tmpStart = new moment(tmpEnd);
    }

    timeFrames.push({
        start: tmpStart,
        end: new moment(end)
    });

    return timeFrames

}


function getRegions() {
    return axios
        .get(`${process.env.PROVIDER_PVL}/pes_list`)
        .then(res => {
            let rtnData = [];
            if (res.status === 200) {
                rtnData = res.data.data.map(x => {
                    return {
                        "pes_id": x[0],
                        "pes_name": x[1],
                        "pes_longname": x[2],
                        "pes_dno": x[3]
                    }
                });
            }

            return rtnData;
        })
        .catch(err => {
            console.log(err)
            return [];
        });
}

module.exports = {
    getData,
    rawDataToSolarData,
    getDataHourly,
    sumData,
    getRegions,
    getTimeFrames
};