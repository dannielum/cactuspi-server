const fs = require('fs');
const express = require('express');

const { Publisher, Plugins } = require('cactuspi-service');
const CommandManager = require('./controllers/command-manager');

const configFile = fs.readFileSync('./config.json');
const config = JSON.parse(configFile);
const { address, port, plugins } = config;

const pluginServices = [];
Object.entries(plugins).forEach(([plugin, options = {}]) => {
  if (options.enabled) {
    try {
      pluginServices.push({
        name: plugin,
        service: Plugins[plugin],
        options,
      });
    } catch ({ message }) {
      console.error(`Plugin Error: ${plugin}`, message);
    }
  }
});

const publisher = new Publisher(config);
const commandManager = new CommandManager(publisher);

const app = express();

pluginServices.forEach(({ name, service, options }) => {
  const plugin = new service(options);
  if (plugin.init) {
    plugin.init();
  }

  app.get(`/${name}/:param?`, async (req, res) => {
    const { message, metadata } = await plugin.fetch(req, res);
    publisher.publish(message, metadata);
  });
});

app.get('/hello', (req, res) => {
  publisher.publish('Hello World!', {
    repeat: false,
    name: 'hello',
    duration: 5,
    priority: true,
  });
  res.send('Hello World!');
});

app.get('/message/:message', (req, res) => {
  const message = req.params.message;
  publisher.publish(`Message: ${message}`, {
    repeat: req.param('repeat') || false,
    name: req.param('name') || 'message',
    duration: req.param('duration') || 10,
    priority: req.param('message') || true,
  });
  res.send(`Message: "${message}"`);
});

app.get('/clear', (req, res) => {
  commandManager.command('clear');
  res.send('Clear');
});

app.get('/stop', (req, res) => {
  commandManager.command('stop');
  res.send('Stop');
});

app.get('/start', (req, res) => {
  commandManager.command('start');
  res.send('Start');
});

app.get('/end', (req, res) => {
  commandManager.command('end');
  res.send('End');
});

const server = app.listen(port, address, () => {
  const address = server.address();
  console.log(
    'Cactus Pi Server started at http://%s:%s',
    address.address,
    address.port
  );
});
