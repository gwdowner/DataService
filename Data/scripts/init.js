const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Region = require('../region');

dotenv.config();
console.log(process.env.DB_CONNECT);
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async conn => {
    await Region.deleteMany().exec();
    // Known locations we want to use to bootstrap the database with 
    data = [
        {
            name: 'South west (SW)',
            codes: {
                pv_live: '22',
                meteo_stat: '03839',
                coords: [50.733997064, -3.4083317]
            }
        }
    ];

    Region.insertMany(data).then(res => {
        console.log('Inserted regions sucessfully');

        return conn.disconnect();
    }).catch(err => {
        console.log('Failed to initialise regions: \n', err);
    }).then(res => {
        console.log('disconnected sucessfully');
    });


}).catch(err => { console.log(err); });

