// @ts-ignore

const path = require('path');
const HTMLWp = require('html-webpack-plugin')
const DotEnv = require('dotenv-webpack')

const env = new DotEnv();
const html = new HTMLWp({
  filename: 'index.html',
  template: './src/templates/index.html',
  inject: true,
});


module.exports = {
  mode: 'development',
  entry: './src/templates/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'templates'),
  },
  plugins: [html, env]
};