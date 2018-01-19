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
    resolve: { extensions: [".ts", ".js"] },
    // Make sure we include all node_modules etc
    externals: [/(node_modules|main\..*\.js)/],
    plugins: [
      new webpack.ContextReplacementPlugin(
        // fixes WARNING Critical dependency: the request of a dependency is an expression
        /(.+)?angular(\\|\/)core(.+)?/,
        path.join(__dirname, "src"), // location of your src
        {} // a map of your routes
      ),
      new webpack.ContextReplacementPlugin(
        // fixes WARNING Critical dependency: the request of a dependency is an expression
        /(.+)?express(\\|\/)(.+)?/,
        path.join(__dirname, "src"),
        {}
      )
    ]
  };
}
