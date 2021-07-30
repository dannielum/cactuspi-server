const request = require('request');

module.exports = class Weather {
  constructor(config) {
    const { city, unit, apiKey } = config;
    this._unit = unit;
    this._weatherUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${city}&units=${unit}&appid=${apiKey}`;
  }

  init() {}

  fetch(req, res) {
    return new Promise((resolve, reject) => {
      request(this._weatherUrl, (error, response, body) => {
        if (error) {
          return reject({ name: 'Plugin Error: weather', error });
        }

        const result = JSON.parse(body);
        if (result.main === undefined) {
          return reject({
            name: 'Plugin Error: weather',
            error: 'failed to get weather data, please try again.',
          });
        }

        const TEMP_UNITS = {
          default: 'K',
          metric: 'C',
          imperial: 'F',
        };
        const unit = TEMP_UNITS[this._unit];
        const temperature = `Now: ${Math.round(
          result.main.temp
        )}'${unit}. Today ${Math.round(
          result.main.temp_min
        )}'${unit} to ${Math.round(result.main.temp_max)}'${unit}.`;
        const condition = `Forecast: ${result.weather[0].description}. Humidity: ${result.main.humidity}%.`;
        const message = `${result.name} - ${temperature} ${condition}`;

        res.send(message);

        return resolve({
          message,
          metadata: {
            repeat: false,
            name: 'weather',
            duration: 35,
            priority: false,
          },
        });
      });
    });
  }
};
