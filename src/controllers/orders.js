const Orders = require('../models/order');
const utils = require('../utils/utils');
const _ = require('lodash');

module.exports = {
  list: (req, res) => {
    const query = req.query || {};
    let shouldFilterByAddress = false;
    let address = null;

    if (query.customerAddress) {
      shouldFilterByAddress = true;
      address = query.customerAddress;
      delete query.customerAddress;
    }

    Orders.apiQuery(query)
      .select('_id customer itemName price currency')
      .populate({ path: 'customer', select: ['name', 'address'] })
      .then(orders => {
        if (shouldFilterByAddress) {
          orders = orders.filter(order => {
            return order.customer.address === address;
          });
        }

        res.json(
          orders.map(order => ({
            orderId: order._id,
            customerName: order.customer.name,
            customerAddress: order.customer.address,
            itemName: order.itemName,
            price: order.price,
            currency: order.currency
          }))
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

  listItems: (req, res) => {
    Orders.find()
      .select('_id itemName')
      .then(orders => {
        const items = orders.reduce((allItems, order) => {
          allItems[order.itemName] = allItems[order.itemName] + 1 || 1;

          return allItems;
        }, {});

        let itemsList = Object.keys(items).map(item => {
          return { itemName: item, count: items[item] };
        });

        res.json(_.orderBy(itemsList, ['count', 'itemName'], ['desc', 'asc']));
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

  get: (req, res) => {
    Orders.findById(req.params.orderId)
      .select('_id customer itemName price currency')
      .populate({ path: 'customer', select: ['name', 'address'] })
      .then(order => {
        if (!order) {
          return res.status(404).send(null);
        }

        res.json({
          orderId: order._id,
          customerName: order.customer.name,
          customerAddress: order.customer.address,
          itemName: order.itemName,
          price: order.price,
          currency: order.currency
        });
      })
      .catch(err => {
        console.error({
          msg: 'api/orders/:orderId get request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(utils.sanitizeMongooseError(err));
      });
  },

  post: (req, res) => {
    const data = { ...req.body } || {};

    data._id = data.orderId;
    delete data.orderId;

    Orders.create(data)
      .then(order => {
        res.json(order);
      })
      .catch(err => {
        console.error({
          msg: 'api/orders post request failed',
          error: err.message,
          response: err.errors
        });

        if (err.message.indexOf('customer does not exist') !== -1) {
          res.status(400).send({ error: err.message });
        } else if (err.message.indexOf('duplicate key error') !== -1) {
          res.status(409).send({ error: `The following orderId already exists: ${data._id}` });
        } else {
          res.status(500).send({ error: utils.sanitizeMongooseError(err) });
        }
      });
  },

  put: (req, res) => {
    const data = req.body || {};
    const id = req.params.orderId;

    if (data.createdAt) {
      delete data.createdAt;
    }

    if (data.updatedAt) {
      delete data.updatedAt;
    }

    Orders.findByIdAndUpdate(id, data, { new: true })
      .then(order => {
        if (!order) {
          return res.sendStatus(404).send(null);
        }

        res.sendStatus(204);
      })
      .catch(err => {
        console.error({
          msg: 'api/orders/:orderId put request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(utils.sanitizeMongooseError(err));
      });
  },

  delete: (req, res) => {
    Orders.findByIdAndRemove(req.params.orderId)
      .then(order => {
        if (!order) {
          return res.sendStatus(404);
        }

        res.sendStatus(204);
      })
      .catch(err => {
        console.error({
          msg: 'api/orders/:orderId delete request failed',
          error: err.message,
          response: err.errors
        });
        res.status(422).send(utils.sanitizeMongooseError(err));
      });
  }
};
