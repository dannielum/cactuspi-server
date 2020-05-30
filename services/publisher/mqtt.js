const MQTT = require('mqtt');

module.exports = class MQTTPublisher {
  constructor(config) {
    this._config = config;

    this._mqtt = MQTT.connect(this._config.brokerUrl);
  }

  publish(message, userMetadata) {
    if (!this._mqtt) {
      throw new Error('MQTT is not initialized');
    }

    const stringifyMessage = JSON.stringify({
      message,
      userMetadata,
    });

    this._mqtt.publish(this._config.topic, stringifyMessage, {}, (error) => {
      if (error) {
        console.log('MQTT', error);
      }
    });
  }
};
