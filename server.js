var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.dev.config');
var serverStatic = require('./server.static');

var compiler = webpack(webpackConfig);
var devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
});
var hotMiddleware = webpackHotMiddleware(compiler);

var app = express();
app.use(devMiddleware);
app.use(hotMiddleware);
app.use(serverStatic.filter('examples'));
app.use(express.static('examples'));

var server = app.listen(8085, function() {
  console.log('LazyPage node.js测试，访问地址为 http://localhost:8085/');
});

//打开默认浏览器
const openDefaultBrowser = function(url) {
  var exec = require('child_process').exec;
  switch (process.platform) {
    case 'darwin':
      exec('open ' + url);
      break;
    case 'win32':
      exec('start ' + url);
      break;
    default:
      exec('xdg-open', [url]);
  }
};
openDefaultBrowser('http://localhost:8085');
