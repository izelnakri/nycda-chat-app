const express = require('express'),
      logger = require('morgan'),
      compression = require('compression'),
      APP_PORT = process.env.PORT || 3005;

let app = express();

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(compression());

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(APP_PORT, () => {
  console.log(`Web server started on port ${APP_PORT}`);
});
