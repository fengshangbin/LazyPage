var express = require("express");
var serverFilter = require("lazypage-node");

var app = express();
app.use(serverFilter.filter("src"));
app.use(express.static("src"));

app.listen(9084, function () {});
