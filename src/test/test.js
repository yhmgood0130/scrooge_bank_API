const supertest = require('supertest');
const should = require('should');

let customer_id;
let account_id;

const server = supertest.agent("http://localhost:4000");

describe('Customer processs', function() {
  describe('/POST /customers', function() {
    it('should create a customer', function(done) {
      server
          .post('/customers')
          .send({ firstName: 'Willam', lastName: 'Regal', email: 'william@regal.com', password: 'gitcoin'})
          .end(function(err,res) {
            should(res.status).be.eql(200);
            customer_id = res.body.customer_id;
            account_id = res.body.account_id;
            done();
          });
    });
  }),

  describe('/GET /customers', function() {
    it('should require authorization', function(done) {
      server
          .get(`/customers/${customer_id}`)
          .expect(401)
          .end(function(err,res){
            if (err) return done(err);
              done();
          });
    });
  
    var auth = {};
    before(loginUser(auth));
  
    it('should return customer information', function(done) {
      server
      .get(`/customers/${customer_id}`)
      .set('Authorization', 'bearer ' + auth.token)
      .end(function(err,res){
        should(res.status).be.eql(200);
        should(res.body).be.a.Object();
        should(res.body[0].email).be.eql('william@regal.com');
        done();
      });
    });
  
    it("should return customer's account", function(done) {
      server
      .get(`/customers/${customer_id}/account`)
      .set('Authorization', 'bearer ' + auth.token)
      .end(function(err,res){
        should(res.status).be.eql(200);
        should(res.body).be.a.Object();
        should(res.body[0].customer_id).be.eql(customer_id);
        should(res.body[0].account_id).be.eql(account_id);
        done();
      });
    });
  
    it("should deposit the money in their account", function(done) {
      server
      .post(`/customers/${customer_id}/account/deposit`)
      .set('Authorization', 'bearer ' + auth.token)
      .send({ account_id: account_id, transaction_amount: 400, transaction_type: 'deposit' })
      .end(function(err,res){
        should(res.status).be.eql(200);
        should(res.body).be.a.Object();
        done();
      });
    });

    it("should withdraw the money in their account", function(done) {
      server
      .post(`/customers/${customer_id}/account/withdraw`)
      .set('Authorization', 'bearer ' + auth.token)
      .send({ account_id: account_id, transaction_amount: -400, transaction_type: 'withdraw' })
      .end(function(err,res){
        should(res.status).be.eql(200);
        should(res.body).be.a.Object();
        done();
      });
    });

    it("should not withdraw the money due to exceeded amount", function(done) {
      server
      .post(`/customers/${customer_id}/account/withdraw`)
      .set('Authorization', 'bearer ' + auth.token)
      .send({ account_id: account_id, transaction_amount: -400, transaction_type: 'withdraw' })
      .end(function(err,res){
        should(res.status).be.eql(400);
        should(res.body).be.a.Object();
        done();
      });
    });

    it("should close (deactivate) the account", function(done) {
      server
      .put(`/customers/${customer_id}`)
      .set('Authorization', 'bearer ' + auth.token)
      .end(function(err,res){
        should(res.status).be.eql(200);
        should(res.body).be.a.Object();
        done();
      });
    });
  });

  
});

function loginUser(auth) {
  return function(done) {
      server
          .post('/auth/login')
          .send({
              email: 'william@regal.com',
              password: 'gitcoin'
          })
          .expect(200)
          .end(onResponse);

      function onResponse(err, res) {
          auth.token = res.body.token;
          return done();
      }
  };
}