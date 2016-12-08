const express = require('express'),
      logger = require('morgan'),
      hbs = require('hbs'),
      request = require('request'),
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

app.get('/fb-login', (req, res) => {
  request(`https://graph.facebook.com/v2.8/oauth/access_token?client_id=1829373514000205&redirect_uri=localhost:3005/fb-token&code=${req.query.code}`, (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      res.redirect('/');
    }
  });


  res.redirect('/');
});


app.get('/fb-token', (req, res) => {
  console.log(req.params);
  console.log(req.query);
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
