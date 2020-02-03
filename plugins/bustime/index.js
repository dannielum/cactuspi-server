const fs = require('fs');
const BusTime = require('mta-bustime');

const configFile = fs.readFileSync(`${__dirname}/config.json`);
const config = JSON.parse(configFile);

module.exports = class Bustime {
  constructor(publisher) {
    this._publisher = publisher;

    this._lineRef = config.lineRef;
    this._directionRef = config.directionRef;
    this._monitoringRef = config.monitoringRef;
    this._maximumStopVisits = config.maximumStopVisits;
  }

  init() {
    this._busTime = new BusTime(config.apiKey);
  }

  fetch(req, res) {
    const options = {
      LineRef: this._lineRef,
      DirectionRef: this._directionRef,
      MonitoringRef: this._monitoringRef,
      MaximumStopVisits: this._maximumStopVisits
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
      if (total > 0) {
        this._publisher.publish(message, {
          'repeat': false,
          'name': 'bustime',
          'duration': 8 + (15 * total),
          'priority': false
        });
      }
    });

    res.send('Bustime fetched');
  }
};
