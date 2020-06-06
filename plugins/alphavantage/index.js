const fs = require('fs');
const request = require('request');

const configFile = fs.readFileSync(`${__dirname}/config.json`);
const config = JSON.parse(configFile);

module.exports = class Weather {
  constructor(publisher) {
    this._publisher = publisher;
  }

  init() {}

  fetch(req, res) {
    const { functionName, symbol: defaultSymbol, apikey } = config;
    const symbol = req.params.param || defaultSymbol;

    const url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=${apikey}`;
    request(url, (err, response, body) => {
      if (err) {
        throw new Error('Alphavantage Error', err);
      }

      const results = JSON.parse(body);

      if (results['Error Message']) {
        throw new Error('Alphavantage Error', results['Error Message']);
      }

      const message = this.parseMessage(functionName, results);

      console.log('Alphavantage', message);
      this._publisher.publish(message, {
        repeat: false,
        name: 'alphavantage',
        duration: 35,
        priority: false,
      });
    });

    res.send('Alphavantage fetched');
  }

  parseMessage(functionName, results) {
    switch (functionName) {
      case 'GLOBAL_QUOTE':
        return `${results['Global Quote']['01. symbol']}: ${results['Global Quote']['05. price']}`;
      default:
        return 'invalid function name';
    }
  }
};
