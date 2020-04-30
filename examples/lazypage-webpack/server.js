const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
var lazypage = require('lazypage-node');

const config = require('./webpack.config.js');
config.mode = 'development';
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  before: app => {
    app.use(lazypage.response());
  }
};

//lazypage.init('src');

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

compiler.hooks.emit.tap('FileListPlugin', compilation => {
  const assets = compilation.assets;
  lazypage.loadconfig('src');
  lazypage.route(assets);
});
//lazypage.init('src');

server.listen(8183, 'localhost', () => {
  console.log('dev server listening on port 8183');
});
