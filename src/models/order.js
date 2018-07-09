const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    _id: { type: Number },
    customer: {
      type: Number,
      ref: 'Customer',
      required: true
    },
    itemName: {
      type: String,
      trim: true,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      trim: true,
      required: true
    }
  },
  { minimize: false }
);

OrderSchema.plugin(timestamps);
OrderSchema.plugin(mongooseStringQuery);

module.exports = exports = mongoose.model('Order', OrderSchema);
