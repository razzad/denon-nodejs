  'use strict';
  var app = require('./app');

// returns an instance of node-letsencrypt with additional helper methods
  var lex = require('letsencrypt-express').create({
  // set to https://acme-v01.api.letsencrypt.org/directory in production
    server: 'https://acme-staging.api.letsencrypt.org/directory'

// If you wish to replace the default plugins, you may do so here
//
, challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) }
, store: require('le-store-certbot').create({
  configDir: '/etc/letsencrypt',                           
  privkeyPath: ':configDir/live/:hostname/privkey.pem', 
  fullchainPath: ':configDir/live/:hostname/fullchain.pem',
  certPath: ':configDir/live/:hostname/cert.pem',    
  chainPath: ':configDir/live/:hostname/chain.pem',           
  workDir: '/var/lib/letsencrypt', 
  logsDir: '/var/log/letsencrypt',  
  webrootPath: '~/letsencrypt/srv/www/:hostname/.well-known/acme-challenge',
  debug: false})

// You probably wouldn't need to replace the default sni handler
// See https://github.com/Daplie/le-sni-auto if you think you do
//, sni: require('le-sni-auto').create({})

, approveDomains: approveDomains
  });
  function approveDomains(opts, certs, cb) {
  // This is where you check your database and associated
  // email addresses with domains and agreements and such


  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
    if (certs) {
      opts.domains = certs.altnames;
    }
    else {
      opts.email = 'robert.bruchhardt@gmail.com';
      opts.agreeTos = true;
      opts.domains = ['jenb0b.spdns.de'];
    }

  // NOTE: you can also change other options such as `challengeType` and `challenge`
  // opts.challengeType = 'http-01';
  // opts.challenge = require('le-challenge-fs').create({});

    cb(null, { options: opts, certs: certs });
  }
// handles acme-challenge and redirects to https
  require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
    console.log('Listening for ACME http-01 challenges on', this.address());
  });




/*
var port= process.env.PORT;

var server = app.listen(port|| 3000, function () {
  console.log('Server listening on ', port || 3000);
*/
// handles your app
  require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
    console.log('Listening for ACME tls-sni-01 challenges and serve app on', this.address());
  });