/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000); // Default timeout for the whole suite

  let id;
  let title;

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        this.timeout(7000); // Specific timeout for this test
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'Test book' })
          .end((err, res) => {
            if (err) done(err);
            id = res.body._id;
            title = res.body.title;
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test book');
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });

    });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

    });

    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get('/api/books/this_is_not_a_valid_id')
          .end(function(err, res) {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .get('/api/books/' + id)
          .end(function(err, res) {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            done();
          })
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
          .request(server)
          .post('/api/books/' + id)
          .send({ comment: 'Test comment' })
          .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, 'Test comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai
          .request(server)
          .post('/api/books/' + id)
          .send({})
          .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai
          .request(server)
          .post('/api/books/not_a_valid_id')
          .send({ comment: 'Test comment 2' })
          .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .delete('/api/books/' + id)
          .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .delete('/api/books/not_a_valid_id')
          .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

    test('Test MongoDB connection', function(done) {
      chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

  });

  after(function() {
    chai.request(server)
      .get('/')
  });
});
