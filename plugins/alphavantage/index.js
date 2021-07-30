const request = require('request');

module.exports = class Weather {
  constructor(config) {
    this._config = config;
  }

  init() {}

  fetch(req, res) {
    const { functionName, symbol: defaultSymbol, apikey } = this._config;
    const symbol = req.params.param || defaultSymbol;

    const url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=${apikey}`;

    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) {
          return reject({
            name: 'Plugin Error: alphavantage',
            error,
          });
        }

        const results = JSON.parse(body);

        if (results['Error Message']) {
          return reject({
            name: 'Plugin Error: alphavantage',
            error: results['Error Message'],
          });
        }

        const message = this.parseMessage(functionName, results);

        res.send(message);

        return resolve({
          message,
          metadata: {
            repeat: false,
            name: 'alphavantage',
            duration: 35,
            priority: false,
          },
        });
      });
    });
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
