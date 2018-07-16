const supertest = require('supertest');
const server = supertest.agent('http://localhost:5000/api');

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

describe('should validate negative test in created', () => {
  it('create order : orders conflit 409', () =>
    server
      .post(`/orders`)
      .send({ orderId: 1, customer: 3, itemName: 'TESTSkates', price: 100, currency: 'EUR' })
      .expect(res => {
        res.body.error.should.equal('The following orderId already exists: 1');
        res.statusCode.should.equal(409);
      }));

  it('create order : orderId to text', () =>
    server
      .post(`/orders`)
      .send({ orderId: 'ABC', customer: 9, itemName: 'TESTSkates', price: 100, currency: 'EUR' })
      .expect(res => {
        res.body.error.should.equal(
          'Order validation failed: _id: Cast to Number failed for value "ABC" at path "_id"'
        );
        res.statusCode.should.equal(500);
      }));

  it('create order : price to text', () =>
    server
      .post(`/orders`)
      .send({ orderId: 10, customer: 3, itemName: 'TESTSkates', price: 'ABC', currency: 'EUR' })
      .expect(res => {
        res.body.error.should.equal(
          'Order validation failed: price: Cast to Number failed for value "ABC" at path "price"'
        );
        res.statusCode.should.equal(500);
      }));

  it('create order : customer to not exist', () =>
    server
      .post(`/orders`)
      .send({ orderId: 10, customer: 30, itemName: 'TESTSkates', price: 100, currency: 'EUR' })
      .expect(res => {
        res.body.error.should.equal('The following customer does not exist: 30.');
        res.statusCode.should.equal(400);
      }));

  it('create order : customer to text', () =>
    server
      .post(`/orders`)
      .send({ orderId: 10, customer: 'ABC', itemName: 'TESTSkates', price: 100, currency: 'EUR' })
      .expect(res => {
        res.body.error.should.equal(
          'Order validation failed: customer: Cast to Number failed for value "ABC" at path "customer"'
        );
        res.statusCode.should.equal(500);
      }));
});

describe('should validate negative test in listing', () => {
  it('create order : order not found', () =>
    server.get(`/orders/0`).expect(res => {
      res.statusCode.should.equal(404);
    }));
});

describe('should validate positive test in listing all', () => {
  it('get sucess', () =>
    server.get(`/orders`).expect(res => {
      res.statusCode.should.equal(200);
    }));
});

describe('should validate positive test in listing', () => {
  it('get sucess', () =>
    server.get(`/orders/1`).expect(res => {
      res.statusCode.should.equal(200);
    }));
});

describe('should validate positive test', () => {
  const orderId = Math.floor(Math.random() * 1000 + 1);
  const createOrder = { orderId, customer: 3, itemName: 'TESTSkates', price: 100, currency: 'EUR' };
  it('create order : sucess', () =>
    server
      .post(`/orders`)
      .send(createOrder)
      .expect(res => {
        res.body.customer.should.equal(createOrder.customer);
        res.body.itemName.should.equal(createOrder.itemName);
        res.body.price.should.equal(createOrder.price);
        res.body.currency.should.equal(createOrder.currency);
        res.body._id.should.equal(createOrder.orderId);
        res.statusCode.should.equal(200);
      }));
  it('delete order : sucess', () =>
    server
      .delete(`/orders/${createOrder.orderId}`)
      .send({ itemName: createOrder.itemName, price: createOrder.price })
      .expect(res => {
        res.statusCode.should.equal(204);
      }));
});
