const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  entry: {
    theme_default: ['./assets/theme_default/js/theme_default.js']
  },

  plugins: [

    //Add version from package.json into every single file as top comment block.
    new WebpackAutoInject({
      PACKAGE_JSON_PATH: './package.json',
      components: {
        AutoIncreaseVersion: true,
      }
    }),

    //Clean dist before each build
    new CleanWebpackPlugin(['dist']),

    //Generate a HTML file 
    new HtmlWebpackPlugin({
      myOptions: {
        title: 'theme_default',
        logo_src: 'img/logo.png'
      },
      template: './templates/base.html',
      inject: true
    }),

    //Move all the required *.css modules in entry chunks into a separate CSS file    
    new ExtractTextPlugin({
      filename: '[name].css'
    }),

    //Copy images from assets folder to dist
    new CopyWebpackPlugin([
      { from: './assets/theme_default/img', to: 'img' }
    ]),

    //Automatically load modules instead of having to import or require them everywhere
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ],

  //Create a vendors chunk, which includes all code from node_modules in the whole application.
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, './dist/theme_default')
  }, 

  module: {

    //Load css/scss 
    rules: [
      {
        test: /\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },

      //Load HTML with nunjucks-isomorphic-loader
      {
        test: /\.html$/,
        use: [
          {
            loader: 'nunjucks-isomorphic-loader',
            query: {
              root: [path.resolve(__dirname, './templates')]

            }
          }
        ]
      }

    ]
  }
};