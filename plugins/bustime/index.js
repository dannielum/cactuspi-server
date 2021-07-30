const BusTime = require('mta-bustime');

module.exports = class Bustime {
  constructor(config) {
    this._options = config.options;
    this._default = config.default;
    this._busTime = new BusTime(config.apiKey);
  }

  init() {}

  fetch(req, res) {
    const param = req.params.param || this._default;
    const busConfig = this._options[param];

    const options = {
      LineRef: busConfig.lineRef,
      DirectionRef: busConfig.directionRef,
      MonitoringRef: busConfig.monitoringRef,
      MaximumStopVisits: busConfig.maximumStopVisits,
    };

    return new Promise((resolve, reject) => {
      this._busTime.stopMonitoring(options, (error, response, body) => {
        if (error) {
          return reject({ name: 'Plugin Error: bustime', error });
        }
        const stopMonitoringDelivery =
          body.Siri.ServiceDelivery.StopMonitoringDelivery;
        let total = 0;
        let message = '';

        stopMonitoringDelivery.forEach((stopMonitoring) => {
          if (stopMonitoring.ErrorCondition) {
            message = stopMonitoring.ErrorCondition.Description;
            return;
          }

          const monitoredStopVisit = stopMonitoring.MonitoredStopVisit;
          message = `There ${monitoredStopVisit.length === 1 ? 'is' : 'are'} ${
            monitoredStopVisit.length
          } bus${monitoredStopVisit.length === 1 ? '' : 'es'} coming. `;
          monitoredStopVisit.forEach((stopVisit) => {
            const monitoredVehicleJourney = stopVisit.MonitoredVehicleJourney;
            const { PresentableDistance, StopsFromCall } =
              monitoredVehicleJourney.MonitoredCall.Extensions.Distances;
            message += `${monitoredVehicleJourney.LineRef.replace(
              'MTA NYCT_',
              ''
            )} is ${
              StopsFromCall > 0
                ? `${StopsFromCall} stop${StopsFromCall === 1 ? '' : 's'} and `
                : ''
            }${PresentableDistance}. `;
            total++;
          });
        });

        res.send(message);

        return resolve({
          message,
          metadata: {
            repeat: false,
            name: 'bustime',
            duration: 8 + 15 * total,
            priority: false,
          },
        });
      });
    });
  }
};
