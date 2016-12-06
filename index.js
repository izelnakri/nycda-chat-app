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

app.listen(APP_PORT, () => {
  console.log(`Web server started on port ${APP_PORT}`);
});
