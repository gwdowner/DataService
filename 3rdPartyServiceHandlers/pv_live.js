const axios = require('axios');
const ONE_HOUR = 1000 * 60 * 60;

async function getData(start, end, pes) {
    
    return axios
        .get(`${process.env.PROVIDER_PVL}/pes/${pes}?start=${start}&end=${end}`)
        .then(res => {

            let data = rawDataToSolarData(res.data.data);
            return  getDataHourly(data);
        })
        .catch(e =>{
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

function getDataHourly(data){
    let returnData = []

    // find all data on the hour
    let hourlyData = data.filter(x => x.time.getMinutes() == 0);
    
    hourlyData.forEach(element => {
        // find all data up to an hour before element
        let intervalData = data.filter(x => x.time < element.time && (element.time.getTime() - x.time.getTime()) < ONE_HOUR )
       
        let newData = {
            time:element.time,
            region:element.region,
            ...sumData([element, ...intervalData])
        }

        returnData.push(newData)
    });

    return returnData;

}

function sumData(data){
    let finalObj = {
        outputMW:0
    }

    data.forEach(element=>{
        finalObj.outputMW += element.outputMW;
    });

    return finalObj;
}

module.exports = {
    getData,
    rawDataToSolarData,
    getDataHourly,
    sumData
};