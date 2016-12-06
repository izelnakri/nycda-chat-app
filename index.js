const express = require('express'),
      logger = require('morgan'),
      hbs = require('hbs'),
      compression = require('compression'),
      APP_PORT = process.env.PORT || 3005;

let app = express(),
    assets = require('./config/assets.json');

hbs.registerHelper('assets', function(asset) {
  return assets[asset];
});

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(compression());

app.use(express.static('public', {
  maxAge: '1y'
}));

app.get('/', (req, res) => {
  res.render('index');
});

var server = app.listen(APP_PORT, () => {
  console.log(`Web server started on port ${APP_PORT}`);
});

let socketServer = require('socket.io')(server);

socketServer.on('connection', function(socket) {
  console.log('Connection happened');

  socket.on('channel:new_user', (username) => {
    socket.emit('channel:user_join', {
      username: username,
      content: `${username} joined our channel`
    });
  });

  socket.on('channel:message', (data) => {
    console.log('server received a message:');
    console.log(data);
    socket.emit('channel:new_message', data);
  });
});
