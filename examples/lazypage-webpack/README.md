# LazyPage 整合 webpack 支持热更新

### GitHub Pages

https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-webpack

### 如何运行

安装依赖

```
npm install
```

开始运行

```
npm run server
```

打包

```
npm run build
```

# 配置 webpack 热更新

### 安装 lazypage-node 和热更新 依赖

```
npm install --save-dev webpack-dev-server lazypage-node
```

### 新建 server.js 文件

```
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

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

compiler.hooks.emit.tap('FileListPlugin', compilation => {
  const assets = compilation.assets;
  lazypage.loadconfig('src');
  lazypage.route(assets);
});

server.listen(8083, 'localhost', () => {
  console.log('dev server listening on port 8083');
});

```

### 添加 package.json server 命令

```
"server": "node server"
```

### 开始测试

```
npm run server
```

### 其他 webpack 功能 如 js 处理 less、css 处理，html 处理，版本号设置，请参考 webpack.config.js 的配置
