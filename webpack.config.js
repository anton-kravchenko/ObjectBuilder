/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  entry: './main.ts',
  mode: 'production',
  module: {
    rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: { extensions: ['.ts'] },
  output: {
    filename: 'ObjectBuilder.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
