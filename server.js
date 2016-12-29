
var app = require('./app');

var env = process.env.NODE_ENV;

if (env =='PROD'){
  var leStore = require('le-store-certbot').create({
    configDir: '~/letsencrypt/etc',          // or /etc/letsencrypt or wherever
    privkeyPath: ':configDir/live/:hostname/privkey.pem',          //
    fullchainPath: ':configDir/live/:hostname/fullchain.pem',      // Note: both that :configDir and :hostname
    certPath: ':configDir/live/:hostname/cert.pem',                //       will be templated as expected by
    chainPath: ':configDir/live/:hostname/chain.pem',              //       node-letsencrypt
    workDir: '~/letsencrypt/var/lib',
    logsDir: '~/letsencrypt/var/log',
    webrootPath: '~/letsencrypt/srv/www/:hostname/.well-known/acme-challenge',
    debug: false
  });


// returns an instance of node-letsencrypt with additional helper methods
  var lex = require('letsencrypt-express').create({
  // set to https://acme-v01.api.letsencrypt.org/directory in production
  //server: 'staging',
    server: 'staging',

  // If you wish to replace the default plugins, you may do so here
  //
    challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '~/letsencrypt/var/acme-challenges' }) },
    store: leStore,


  // You probably wouldn't need to replace the default sni handler
  // See https://github.com/Daplie/le-sni-auto if you think you do
  //, sni: require('le-sni-auto').create({})

    approveDomains: approveDomains
  });



// handles acme-challenge and redirects to https
  require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
    console.log('PROD: Listening for ACME http-01 challenges on', this.address());
  });

  server = require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
    console.log('PROD: Listening for ACME tls-sni-01 challenges and serve app on', this.address());
  });

}else{

  var server = app.listen(process.env.PORT || 3000, function () {
    console.log('DEV: Server listening on ', process.env.PORT || 3000);
  });
}

function approveDomains(opts, certs, cb) {
  // TODO - verify domain

  if (certs) {
    opts.domains = certs.altnames;
  }
  else {
    opts.email = 'robert.bruchhardt@gmail.com';
    opts.domains = ['jenb0b.spdns.de'];
    opts.agreeTos = true;
  }

  cb(null, { options: opts, certs: certs });
}