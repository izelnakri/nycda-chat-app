const express = require('express'),
      logger = require('morgan'),
      hbs = require('hbs'),
      request = require('request'),
      compression = require('compression'),
      session = require('express-session'),
      FB = require('./services/fb'),
      APP_PORT = process.env.PORT || 3005;

let app = express(),
    assets = require('./config/assets.json');

hbs.registerHelper('assets', function(asset) {
  return assets[asset];
});

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(compression());

app.use(session({
  secret: 'keyboard cat'
}));

app.use(express.static('public', {
  maxAge: '1y'
}));

app.get('/', (req, res) => {
  if (req.session.user) {
    res.render('application', { user: req.session.user });
  } else {
    res.render('welcome');
  }
});

app.get('/fb-login', (req, res) => {
  FB.getAccessToken(req.query.code, (userData) => {
    req.session.user = userData;
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});


var server = app.listen(APP_PORT, () => {
  console.log(`Web server started on port ${APP_PORT}`);
});

let socketServer = require('socket.io')(server);

socketServer.on('connection', function(socket) {
  console.log('Connection happened');

  socket.on('channel:new_user', (username) => {
    let joinMessage = {
      username: username,
      content: `${username} joined our channel`
    };

    socket.emit('channel:user_join', joinMessage);
    socket.broadcast.emit('channel:user_join', joinMessage);
  });

  socket.on('channel:message', (data) => {
    console.log('server received a message:');
    socket.emit('channel:new_message', data);
    socket.broadcast.emit('channel:new_message', data);
  });
});
