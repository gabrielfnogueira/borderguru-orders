const express = require('express');
const Customers = require('../controllers/customers');
const app = express();

app.route('/customers').get(Customers.list);
app.route('/customers/:customerId').get(Customers.get);
app.route('/customers/:customerId').put(Customers.put);
app.route('/customers/').post(Customers.post);
app.route('/customers/:customerId').delete(Customers.delete);

module.exports = app;
