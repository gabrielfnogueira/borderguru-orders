const mongoose = require('mongoose');
require('dotenv').load();

mongoose.Promise = global.Promise;

const mongoURL = `mongodb://mongo:27017/borderguru`;

const connection = mongoose.connect(
  mongoURL,
  { useNewUrlParser: true }
);

connection
  .then(db => {
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
