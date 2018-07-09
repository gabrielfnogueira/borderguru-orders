const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const dirRoutes = path.join(__dirname, 'routes');

const PORT = 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

process.on('uncaughtException', err => {
  console.log(err);
  process.exit(1);
});

app.use(compression());

//---------------------------------//
//------- Last Server Setup -------//
//---------------------------------//

app.disable('x-powered-by');

app.listen(PORT, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  require('./utils/db');

  fs.readdirSync(dirRoutes).map(file => {
    const route = path.join(dirRoutes, file);
    app.use('/api', require(route));
  });

  const env = process.env.NODE_ENV || 'dev';

  console.log(`"borderguru-order-api" listening on port ${PORT} on "${env}"`);
});

module.exports = app;
