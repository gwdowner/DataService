const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Region = require('../region');

dotenv.config();
console.log(process.env.DB_CONNECT);
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(conn => {
    console.log('connected to db');

    // Known locations we want to use to bootstrap the database with 
    data = [{
        name: 'Sout west (SW)',
        codes: {
             pv_live: '22' ,
             meteo_stat: '03839' 
        }
    }];

    Region.insertMany(data).then(res => {
        console.log('Inserted regions sucessfully');
        
        return conn.disconnect();
    }).catch(err => {
        console.log('Failed to initialise regions: \n', err);
    }).then(res => {
        console.log('disconnected sucessfully');
    });

    
}).catch(err => { console.log(err); });

