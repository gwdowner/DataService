// package dependancies
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const app = express();
const server = http.createServer(app);

dotenv.config();
const config = require('./config');

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

app.use('/api', routes);

server.listen(process.env.PORT, function () {
    console.log('server listening on port: ' + process.env.PORT);
});

