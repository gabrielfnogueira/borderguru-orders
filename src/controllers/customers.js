const Customers = require('../models/customer');
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
        res.status(500).send(utils.sanitizeMongooseError(err));
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
