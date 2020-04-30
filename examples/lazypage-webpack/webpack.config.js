const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    one: ['./src/js/one.js'],
    two: ['./src/js/two.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyPlugin([{ from: 'src/include', to: 'include' }, { from: 'src/config.json', to: 'config.json' }, { from: 'src/js/format.js', to: 'js/format.js' }]),
    new HtmlWebpackPlugin({
      template: './src/$-.html', //模板文件地址
      filename: '$-.html', //文件名，默认为index.html（路径相对于output.path的值）
      inject: true, //script标签的位置，true/body为在</body>标签前，head为在<head>里，false表示页面不引入js文件
      hash: true, //是否为引入的js文件添加hash值
      chunks: ['commons', 'one'], //页面里要引入的js文件，值对应的是entry里的key。省略参数会把entry里所有文件都引入
      minify: {
        collapseWhitespace: true, //压缩空格
        //removeAttributeQuotes: true, //移除引号
        removeComments: true //移除注释
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/$+$-.html',
      filename: '$+$-.html',
      inject: true,
      hash: true,
      chunks: ['commons', 'two'],
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons', //提取出来的文件命名
          chunks: 'initial', //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0 //表示提取公共部分最小的大小
        }
      }
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }, { loader: 'less-loader' }, { loader: 'postcss-loader' }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //outputPath: 'images/', //输出到images文件夹
              limit: 5120 //是把小于5KB的文件打成Base64的格式，写入JS
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  target: 'web'
};
