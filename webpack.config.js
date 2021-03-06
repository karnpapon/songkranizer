const path = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
    content: path.resolve(__dirname, 'src/content.js'),
    audiocontent: path.resolve(__dirname, 'src/audiocontent.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.frag$/, loader: 'raw-loader', exclude: /node_modules/ },
    ],
  },
};