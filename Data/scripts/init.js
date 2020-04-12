const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Region = require('../region');
const regionsData = require('./regionsDataSeed.json');

dotenv.config();

console.log('Connecting to DB...');
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async conn => {
    data = regionsData;
    newItems = [];
    for(let element of data){
        let tmpRegion = await Region.findOne({ regionCode: element.regionCode }).then();
        
        if (tmpRegion) {
            console.log(`Updating region ${element.name}`);
            await tmpRegion.set(element).save();
            
        } else {
            console.log(`Creating region ${element.name}`);
           let newRegion = await new Region(element).save();
        }
    }
    
    return conn.disconnect();
  


}).catch(err => { console.log(err); }).then(res =>{
    console.log('DISCONECTED SUCESSFULLY...')
});