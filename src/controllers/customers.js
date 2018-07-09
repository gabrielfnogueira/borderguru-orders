const Customers = require('../models/customer');
const Orders = require('../models/order');
const utils = require('../utils/utils');

module.exports = {
  list: (req, res) => {
    const query = req.query || {};

    Customers.apiQuery(query)
      .select('_id name address deleted')
      .then(customers => {
        res.json(
          customers.map(customer => ({
            customerId: customer._id,
            name: customer.name,
            address: customer.address,
            deleted: customer.deleted
          }))
        );
      })
      .catch(err => {
        console.error({
          msg: 'api/customers get request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(err.message);
      });
  },

  get: (req, res) => {
    Customers.findById(req.params.customerId)
      .select('_id name address')
      .then(customer => {
        if (!customer) {
          return res.status(404).send(null);
        }

        res.json({
          customerId: customer._id,
          name: customer.name,
          address: customer.address
        });
      })
      .catch(err => {
        console.error({
          msg: 'api/customers/:customerId get request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(utils.sanitizeMongooseError(err));
      });
  },

  getPaidAmount: (req, res) => {
    const query = { customer: req.params.customerId };

    Orders.apiQuery(query)
      .select('_id customer price currency')
      .then(orders => {
        const amounts = orders.reduce((amount, order) => {
          amount[order.currency] = amount[order.currency] + order.price || order.price;

          return amount;
        }, {});

        res.json(Object.keys(amounts).map(currency => ({ currency: currency, totalAmount: amounts[currency] })));
      })
      .catch(err => {
        console.error({
          msg: 'api/orders get request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(err.message);
      });
  },

  getBoughtItem: (req, res) => {
    const query = { itemName: req.params.itemName };

    Orders.apiQuery(query)
      .select('_id customer')
      .populate('customer')
      .then(orders => {
        res.json(
          orders.map(order => {
            return {
              orderId: order._id,
              customerId: order.customer._id,
              customerName: order.customer.name,
              customerAddress: order.customer.address
            };
          })
        );
      })
      .catch(err => {
        console.error({
          msg: 'api/orders get request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(err.message);
      });
  },

  post: (req, res) => {
    const data = { ...req.body } || {};

    data._id = data.customerId;
    delete data.customerId;

    Customers.create(data)
      .then(order => {
        res.json(order);
      })
      .catch(err => {
        console.error({
          msg: 'api/customers post request failed',
          error: err.message,
          response: err.errors
        });

        if (err.message.indexOf('duplicate key error') !== -1) {
          res.status(409).send({ error: `The following customerId already exists: ${data._id}` });
        } else {
          res.status(500).send({ error: utils.sanitizeMongooseError(err) });
        }
      });
  },

  put: (req, res) => {
    const data = req.body || {};
    const id = req.params.customerId;

    if (data.createdAt) {
      delete data.createdAt;
    }

    if (data.updatedAt) {
      delete data.updatedAt;
    }

    Customers.findByIdAndUpdate(id, data, { new: true })
      .then(customer => {
        if (!customer) {
          return res.sendStatus(404).send(null);
        }

        res.sendStatus(204);
      })
      .catch(err => {
        console.error({
          msg: 'api/customers/:customerId put request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(utils.sanitizeMongooseError(err));
      });
  },

  delete: (req, res) => {
    Customers.findById(req.params.customerId)
      .then(customer => {
        if (!customer) {
          return res.sendStatus(404);
        }

        customer.delete(() => {
          res.sendStatus(204);
        });
      })
      .catch(err => {
        console.error({
          msg: 'api/customers/:customerId delete request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(utils.sanitizeMongooseError(err));
      });
  }
};
