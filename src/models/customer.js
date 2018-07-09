const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');
const mongooseDelete = require('mongoose-delete');
const { Schema } = mongoose;

const CustomerSchema = new Schema(
  {
    _id: { type: Number },
    name: {
      type: String,
      trim: true,
      required: true
    },
    address: {
      type: String,
      trim: true,
      required: true
    }
  },
  { minimize: false }
);

CustomerSchema.plugin(timestamps);
CustomerSchema.plugin(mongooseStringQuery);
CustomerSchema.plugin(mongooseDelete);

module.exports = exports = mongoose.model('Customer', CustomerSchema);
