const fs = require('fs');
const path = require('path');
let config = JSON.parse(fs.readFileSync(path.join(__dirname, 'production.config.json')));

for(let item in config){
    process.env[item] = config[item];
}
