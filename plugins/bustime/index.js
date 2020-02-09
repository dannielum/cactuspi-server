const fs = require('fs');
const BusTime = require('mta-bustime');

const configFile = fs.readFileSync(`${__dirname}/config.json`);
const config = JSON.parse(configFile);

module.exports = class Bustime {
  constructor(publisher) {
    this._publisher = publisher;
  }

  init() {
    this._busTime = new BusTime(config.apiKey);
  }

  fetch(req, res) {
    const param = req.params.param || config.default;
    const busConfig = config.options[param];

    const options = {
      LineRef: busConfig.lineRef,
      DirectionRef: busConfig.directionRef,
      MonitoringRef: busConfig.monitoringRef,
      MaximumStopVisits: busConfig.maximumStopVisits
    };
    this._busTime.stopMonitoring(options, (err, res, body) => {
      if (err) {
        throw new Error('BusTime Error', err);
      }
      const stopMonitoringDelivery = body.Siri.ServiceDelivery.StopMonitoringDelivery;
      let total = 0;
      let message = '';

      stopMonitoringDelivery.forEach(stopMonitoring => {
        const monitoredStopVisit = stopMonitoring.MonitoredStopVisit;
        message = `There ${monitoredStopVisit.length === 1 ? 'is' : 'are'} ${monitoredStopVisit.length} bus${monitoredStopVisit.length === 1 ? '' : 'es'} coming. `;
        monitoredStopVisit.forEach(stopVisit => {
          const monitoredVehicleJourney = stopVisit.MonitoredVehicleJourney;
          const { PresentableDistance, StopsFromCall } = monitoredVehicleJourney.MonitoredCall.Extensions.Distances;
          message += `${monitoredVehicleJourney.LineRef.replace('MTA NYCT_', '')} is ${StopsFromCall > 0 ? `${StopsFromCall} stop${StopsFromCall === 1 ? '' : 's'} and ` : ''}${PresentableDistance}. `;
          total ++;
        });
      });

      console.log('Bustime', message);
      this._publisher.publish(message, {
        'repeat': false,
        'name': 'bustime',
        'duration': 8 + (15 * total),
        'priority': false
      });
    });

    res.send('Bustime fetched');
  }
};
