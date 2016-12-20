var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());

app.use('/api/denon', require('./controllers/api/denon'));


module.exports = app;