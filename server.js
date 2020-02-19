// package dependancies
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodeCron = require('node-cron');
const BatchJobs = require('./BatchJobs/index');
const routes = require('./routes/index');
const app = express();
const server = http.createServer(app);

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log('Error db connection: ' + err);
    } else {
      console.log('Connected to DB');
    }
});

// Run once the first time to generate data on startup //
BatchJobs();

// run at the end of every day at 1 minute past midnight '1 0 * * *'
nodeCron.schedule(process.env.BATCH_UPDATE_RATE, ()=>{
    BatchJobs();
});

app.use('/api', routes);

server.listen(process.env.PORT, function () {
    console.log('server listening on port: ' + process.env.PORT);
});

