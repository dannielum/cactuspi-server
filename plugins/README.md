# Plugins

Plugins are middleware services to fetch data from other third party APIs to be send to the CactusPi client.

## Plugin Configs

In order to be able to fetch data from these plugins, you need to sign up for developer account and obtain API keys.

- [BusTime](./bustime/README.md)
- [Weather](./weather/README.md)

## Create Your Own Plugins

It is easy to create your own plugins. You might have other messages you want to fetch that is not already built in to CactusPi Server. For example, you can send email notifications to your led matrix board by creating a new plugin and fetch the data from that chat messanger API in order to send it to the CactusPi Client. If you do create your own plugins, please do fork it and create pull request to help contribute to the project.

To help follow the conventions, please follow the instructions below.

### Instructions

Please use [plugin-template](./plugin-template) as reference.

1. Create a new directory for your plugin in `cactuspi-server/plugins/`.
2. Create these four files in the directory.
   - config.sample.json
   - index.js
   - README.md
3. Follow the instruction in the provided template.
4. Make sure you add your plugins to the project `config.json`. Please note that the plugin name here is the directory name of your plugin. Set the config required for your plugin in the project `config.json`, and set the `enabled` value to `true` to enable it.

```json
  "plugins": {
    "weather": {
      "enabled": true,
      "apiKey": "",
      "city": "",
      "unit": ""
    },
    "bustime": {
      "enabled": true,
      "apiKey": "",
      "default": "",
      "options": {
        "busstop": {
          "directionRef": 0,
          "maximumStopVisits": 3,
          "monitoringRef": 12345,
          "lineRef": ""
        }
      }
    },
    "alphavantage": {
      "enabled": true,
      "apikey": "",
      "functionName": "",
      "symbol": ""
    }
  }
```

### Message Metadata

```js
return new Promise((resolve, reject) => {
  // your plugin logic here
  
  resolve(message, {
    repeat: false,
    name: 'apiName',
    duration: 30,
    priority: false,
  });
});
```

| Field      | Value                                                 |
| ---------- | ----------------------------------------------------- |
| `repeat`   | `true` to loop the message                            |
| `name`     | name of the API                                       |
| `duration` | number of seconds to display                          |
| `priority` | `true` to push this message to the first of the queue |
