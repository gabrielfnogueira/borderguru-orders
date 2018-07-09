const express = require('express');
const Orders = require('../controllers/orders');
const app = express();

app.route('/orders').get(Orders.list);
app.route('/orders/ordered-items').get(Orders.listItems);
app.route('/orders/:orderId').get(Orders.get);
app.route('/orders/:orderId').put(Orders.put);
app.route('/orders/').post(Orders.post);
app.route('/orders/:orderId').delete(Orders.delete);

module.exports = app;
