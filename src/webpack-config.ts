import * as webpack from "webpack";
import * as path from "path";
import { CliOptions } from "./interfaces";

export function makeWebpackConfig(options: CliOptions, outfilePath: string): webpack.Configuration {
  return {
    entry: options.entryPoint,
    output: {
      // Puts the output at the root of the dist folder
      path: outfilePath,
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: `ts-loader?configFile=${options.tsConfigPath}`
        }
      ]
    },
    target: "node",
    devtool: 'source-map',
    resolve: { extensions: [".ts"] },
  };
}
