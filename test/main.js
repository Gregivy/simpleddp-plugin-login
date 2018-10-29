const assert = require('chai').assert;

const simpleDDP = require('simpleddp').default;
const simpleDDPLogin = require('../lib/main.js').simpleDDPLogin;
const ws = require("ws");

const opts = {
    endpoint: "ws://localhost:3000/websocket",
    SocketConstructor: ws,
    reconnectInterval: 5000,
    //autoConnect: false
};

describe('simpleDDP Login', function(){
  let server = new simpleDDP(opts,[simpleDDPLogin]);
  let logInCounter = 0, logOutCounter = 0, resumeCounter = 0, loginSessionLostCounter = 0;

  server.on('login', function() {
    logInCounter++;
  });

  server.on('logout', function() {
    logOutCounter++;
  });

  server.on('loginSessionLost', function() {
    loginSessionLostCounter++;
  });

  server.on('loginResume', function() {
    resumeCounter++;
  });

  let token = "";

  describe('#login', function (){

    it('should succefully login', function (done) {

      server.connect().then(function(){
        server.login({password:"admin",user:{username:"admin"}}).then(function(m) {
          if (m.type == "password") {
            token = m.token;
            done();
          }
        });
      });

    });

    it('should recieve authorized method answer', function (done) {

      server.call("test").then(function(m) {
        if (m.id == server.userId) done();
      });

    });

    it('should re-login after disconnect', function (done) {

      server.disconnect().then(function(){
        server.connect().then(function(){
          server.call("test").then(function(m) {
            if (m.id == server.userId) done();
          });
        });
      });

    });

  });

  describe('#logout', function (){

    it('should succefully logout', function (done) {

      server.logout().then(done);

    });

    it('should return undefined user id as we logout', function (done) {

      server.call("test").then(function(m) {
        assert.isNotTrue(m.id);
        done();
      });

    });

    it('login resume should not work as we logged out', function (done) {

      server.login({resume:token}).then(null,function () {done();});

    });

  });

  describe('#events', function (){

    it('logInCounter should be equal to 1', function () {

      assert.equal(logInCounter,1);

    });

    it('logOutCounter should be equal to 1', function () {

      assert.equal(logOutCounter,1);

    });

    it('loginSessionLostCounter should be equal to 1', function () {

      assert.equal(loginSessionLostCounter,1);

    });

    it('resumeCounter should be equal to 1', function () {

      assert.equal(resumeCounter,1);

    });

  });

  after(function() {
    // runs after all tests in this block
    server.disconnect();
    server = null;
  });
});
