const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require("webpack")

module.exports = {
  entry: {
	lazypage: [
		'./src/index.js'
		]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
	new webpack.BannerPlugin(' lazypage.js \n by fengshangbin 2019-01-10 \n https://github.com/fengshangbin/LazyPage \n Easy H5 Page Framework')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
	publicPath: '/dist/',
    filename: '[name].js',
	library: 'LazyPage'
  },
  devServer: {
    contentBase: './examples',
	inline: true
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
          use: [
            'style-loader',
            'css-loader'
          ]
        }
		  
	  ]
  },
  target: 'web',
  mode: "development" //"production"
};