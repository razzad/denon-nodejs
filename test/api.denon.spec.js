var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app');



describe('/api/denon', function () {

  request = request(app);

  describe('POST', function () {

    var commandSent = 'volume';
    var commandSentOn = 'power';
    var commandSentOff = 'power';
    var parameterSent = 60;
    var parameterSentOn = 'on';
    var parameterSentOff = 'off';
    var username = 'Robert';
    var password ='secret';
    var wrongPassword='wrongsecret';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var wrongAuth = 'Basic ' + new Buffer(username + ':' + wrongPassword).toString('base64');
    var command, commandOn, commandOff ;
    before(function () {
      command = {
        command: commandSent,
        parameter: parameterSent
      };
      commandOn = {
        command: commandSentOn,
        parameter: parameterSentOn
      };
      commandOff = {
        command: commandSentOff,
        parameter: parameterSentOff
      };
    });
    context('when unauthenticated', function () {
      it('responds with status 401 and WWW-Authenticate', function (done) {
        request
          .post('/api/denon')
          .set('Authorization', wrongAuth)
          .expect(401)
          .expect('WWW-Authenticate', 'Basic realm="JenB0b"', done);
      });
    });

    context('when authenticated', function () {
      it('responds to invalid/missing command with status 400', function (done) {
        request
          .post('/api/denon')
          .set('Authorization', auth)
          .expect(400, done);
      });
    
      it('responds to valid volume command with command done and status 200', function (done) {
        request
          .post('/api/denon')
          .send(command)
          .set('Authorization', auth)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.have.property('command', commandSent)
              .and.to.be.a('string');
            expect(res.body).to.have.property('parameter', parameterSent)
              .and.to.be.a('number');
            
            done();
          });
      });
      it('responds to valid on command with command done and status 200', function (done) {
        request
          .post('/api/denon')
          .send(commandOn)
          .set('Authorization', auth)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.have.property('command', commandSentOn)
              .and.to.be.a('string');
            expect(res.body).to.have.property('parameter', parameterSentOn)
              .and.to.be.a('string');
            
            done();
          });
      });
      it('responds to valid off command with command done and status 200', function (done) {
        request
          .post('/api/denon')
          .send(commandOff)
          .set('Authorization', auth)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.have.property('command', commandSentOff)
              .and.to.be.a('string');
            expect(res.body).to.have.property('parameter', parameterSentOff)
              .and.to.be.a('string');
            
            done();
          });
      });
    });
    


  });
});
