const path = require('path');

module.exports = {
  entry: './main.ts',
  mode: 'production',
  module: {
    rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: { extensions: ['.ts'] },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
