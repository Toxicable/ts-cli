const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './project/main.ts',
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(process.cwd(), 'dist'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: `ts-loader?configFile=project/tsconfig.app.json`
      }
    ]
  },
  target: "node",
  //devtool: 'cheap-module-eval-source-map',
  //devtool: 'source-map',
   devtool: 'inline-source-map',
  resolve: { extensions: [".ts"] },

}
