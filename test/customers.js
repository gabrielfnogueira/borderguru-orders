const supertest = require('supertest');
const server = supertest.agent('http://localhost:5000/api');

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

describe('should validate negative test in created', () => {
  it('create order : orders conflit 409', () =>
    server
      .post(`/customers`)
      .send({ customerId: 2, name: 'John Smith', address: 'Reeperbahn 153' })
      .expect(res => {
        res.body.error.should.equal('The following customerId already exists: 2');
        res.statusCode.should.equal(409);
      }));
});

describe('should validate negative test in listing', () => {
  it('create order : order not found', () =>
    server.get(`/customers/0`).expect(res => {
      res.statusCode.should.equal(404);
    }));
});

describe('should validate positive test in listing all', () => {
  it('get sucess', () =>
    server.get(`/customers`).expect(res => {
      res.statusCode.should.equal(200);
    }));
});

describe('should validate positive test in listing', () => {
  it('get sucess', () =>
    server.get(`/customers/1`).expect(res => {
      res.statusCode.should.equal(200);
    }));

  it('get sucess paid amount', () =>
    server.get(`/customers/2/paid-amount`).expect(res => {
      res.statusCode.should.equal(200);
    }));

  it('get sucess bought', () =>
    server.get(`/customers/bought/Playstation 4`).expect(res => {
      res.statusCode.should.equal(200);
    }));
});

describe('should validate positive test', () => {
  const customerId = Math.floor(Math.random() * 1000 + 1);
  const createCustomer = { customerId, name: 'John Smith', address: 'Reeperbahn 153' };

  it('create curstomer : sucess', () =>
    server
      .post(`/customers`)
      .send(createCustomer)
      .expect(res => {
        res.body.name.should.equal(createCustomer.name);
        res.body.address.should.equal(createCustomer.address);
        res.body._id.should.equal(createCustomer.customerId);
        res.statusCode.should.equal(200);
      }));

  it('update curstomer : sucess', () =>
    server
      .put(`/customers/${customerId}`)
      .send({ update: true })
      .expect(res => {
        res.statusCode.should.equal(204);
      }));
});
