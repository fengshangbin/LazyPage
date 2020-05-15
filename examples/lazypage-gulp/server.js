var express = require('express');
var lazypage = require('lazypage-node');

var app = express();
app.use(lazypage.filter('src'));
app.use(express.static('src'));

app.listen(9084, function() {});
