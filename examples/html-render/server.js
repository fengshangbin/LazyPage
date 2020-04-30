var express = require('express');
var serverFilter = require('lazypage-node');

var app = express();
app.use(serverFilter.filter('static')); // src为当前项目前端代码目录
app.use(express.static('static'));

//global.format = require('./static/js/format');

app.listen(8181, function() {
  console.log('start lazypage server，访问地址为 http://localhost:8181/');
});
