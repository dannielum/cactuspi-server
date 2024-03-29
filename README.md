# Cactus Pi Server

A Raspberry Pi server to manage messages to be sent to the [CactusPi Client](https://github.com/dannielum/cactuspi-client).

## Hardware Setup

- Raspberry Pi

## Services

- Publisher
  - AWS SQS
  - PubNub
  - MQTT (Home Assistant)

## Controllers

- CommandManager

## Built-In End Points

- `/hello` - sends `'Hello World!'` to cactuspi client
- `/message/:message` - sends given message to cactuspi client
- `/start` - sends start command to start the message queue on cactuspi client
- `/stop` - sends stop command to pause the message queue on cactuspi client (can resume with start command)
- `/clear` - sends clear command to empty the message queue on cactuspi client
- `/end` - sends end command to stop and empty the message queue on cactuspi client

## Plugins

Cactus Pi Server is importing the plugins from the [Cactus Pi Service](https://github.com/dannielum/cactuspi-service) library. Some of the availale plugins are:

- [Weather](./plugins/weather/)
- [Bustime](./plugins/bustime/)
- [AlphaVantage](./plugins/alphavantage/)

[Set up plugin configs](./plugins/#Plugin-Configs)

[Create your own plugins](./plugins/#Create-Your-Own-Plugins)

## Instructions

1. Download cactuspi-server.

```
git clone https://github.com/dannielum/cactuspi-server.git
cd cactuspi-server
npm i
```

2. Create config.json.

```
cd cactuspi-server
cp config.json.sample config.json
```

3. Open config.json and set the `address` and `port` of the service.
4. Replace the SQS, PubNub, or MQTT configs in `config.json`.
5. Set `pubsubType` to `sns`, `pubnub`, or `mqtt` in `config.json`.
6. Run

```
npm start
```

## Debugging

To test if your server is running, run

```
curl localhost:8081/hello
```

Assuming you are running it on `localhost` with port `8081`. You should see `Hello World!` is returned on the terminal if the server is responding.
