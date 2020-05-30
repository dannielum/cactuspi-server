const PubNubPublisher = require('./pubnub');
const MQTTPublisher = require('./mqtt');

module.exports = class Publisher {
  constructor(config) {
    switch (config.pubsubType) {
      case 'pubnub':
        return new PubNubPublisher(config.pubnub);
      case 'mqtt':
        return new MQTTPublisher(config.mqtt);
      default:
        return null;
    }
  }
};
