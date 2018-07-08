const mongoose = require('mongoose');
require('dotenv').load();

mongoose.Promise = global.Promise;

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const database = process.env.MONGODB_DATABASE;
const mongoURL = `mongodb://${user}:${password}@${host}:${port}/${database}`;
const connection = mongoose.connect(
  mongoURL,
  { useNewUrlParser: true }
);

connection
  .then(db => {
    // console.log(`Successfully connected to ${process.env.MONGODB_HOST} MongoDB cluster in ${process.env.NODE_ENV} mode.`);
    return db;
  })
  .catch(err => {
    if (err.message.code === 'ETIMEDOUT') {
      console.error('ETIMEDOUT - Attempting to re-establish database connection.', err);
      mongoose.connect(dbUri);
    } else {
      console.log('Error while attempting to connect to database:', err);
    }
  });

module.exports = connection;
