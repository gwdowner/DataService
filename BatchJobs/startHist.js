// runs the migration as a standalone script
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const config = require('../config');
const batchJobs = require('./index');

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async conn => {
  console.log('Connected to DB');
  await batchJobs.runHistJob();

  return conn.disconnect();
}).catch(err => {
  console.log('Error db connection: ' + err);
}).then(conn =>{
  console.log('disconnected successfully');
});

