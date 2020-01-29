const PV_Live = require('../3rdPartyServiceHandlers/pv_live');
const SolarData = require('../Data/solarData');

module.exports = async function(){
    var start = new Date(2020,0,28,12,00,00); 
    var end = new Date(Date.now());
    var solarData = await PV_Live.getData(start.toISOString(), end.toISOString()).then();
    solarData = PV_Live.rawDataToSolarData(solarData);
    SolarData.insertMany(solarData).then(res => console.log(res));
   
    
}