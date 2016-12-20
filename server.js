var app = require('./app');

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on ', process.env.PORT || 3000);
});