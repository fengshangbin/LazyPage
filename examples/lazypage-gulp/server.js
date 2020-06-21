var express = require("express");
var lazypage = require("lazypage-node");

var port = process.env.PORT || 9084;

var app = express();
app.use(lazypage.filter("src"));
app.use(express.static("src"));

app.listen(port, function () {});
