var express = require('express');
var serverFilter = require('lazypage-node');

var app = express();
app.use(serverFilter.filter('src'));
app.use(express.static('src'));

global.format = require('./src/js/format');

app.listen(7000, function() {});
