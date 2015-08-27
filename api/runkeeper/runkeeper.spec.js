//test file for /snd-client-api/ endpoint: twitterfriend

var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:7200')

describe('GET /api/twitterfriend/', function(){
  it('respond with json', function(done){
    api
      .get('/api/twitterfriend/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
});