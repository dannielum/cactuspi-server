const fs = require('fs');
const request = require('request');

const configFile = fs.readFileSync(`${__dirname}/config.json`);
const config = JSON.parse(configFile);

module.exports = class Weather {
  constructor(publisher) {
    this._publisher = publisher;

    // get the config params
    const { params } = config;

    // define your api url
    this._url = `http://your-api.com?params=${params}}&appKey=${apiKey}`;
  }

  init() {
    // do init works
  }

  fetch(req, res) {
    // do fetch work
    request(this._url, (err, response, body) => {
      if (err) {
        throw new Error('Error', err);
      }

      const message = JSON.parse(body);

      console.log('API', message);
      this._publisher.publish(message, {
        'repeat': false,  // whether this message will loop in the cactuspi-client
        'name': 'api-name', // name of your api
        'duration': 35, // number of seconds to run
        'priority': false // display immediate or push to queue
      });
    });

    res.send('API fetched');
  }
};
