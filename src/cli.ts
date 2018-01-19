import { exec, fork, ChildProcess } from 'child_process';
import * as path from 'path';
import * as webpack from 'webpack';
import * as fs from 'fs'

const settings = {
  tsConfigPath: 'project/tsconfig.app.json',
  entryPoint: './project/main.ts',
  outputPath: './dist/'
}

const outfilePath = path.join(process.cwd(), settings.outputPath)
const outfile = path.join(outfilePath, 'server.bundle.js')

const webpackConfig: webpack.Configuration = {
  entry: settings.entryPoint,
  output: {
    // Puts the output at the root of the dist folder
    path: outfilePath,
    filename: 'server.bundle.js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: `ts-loader?configFile=${settings.tsConfigPath}` }
    ]
  },  
  target: 'node',
  resolve: { extensions: ['.ts', '.js'] },
  // Make sure we include all node_modules etc
  externals: [/(node_modules|main\..*\.js)/,],
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
}

const compiler = webpack(webpackConfig);

let subProcess: ChildProcess;
let lastHash: string = null;

compiler.watch({}, (err, stats) => {
    console.log('=======================webpack=======================')

    if(err) {
        // Do not keep cache anymore
        //compiler.purgeInputFileSystem();
    }
    if(err) {
        lastHash = null;
        console.error(err.stack || err);
        if(err['details']) {
          console.error('really bad error', err['details'])
        }
        process.exitCode = 1;
        return;
    }
    if(stats['hash'] !== lastHash) {
        lastHash = stats['hash'];
        var statsString = stats.toString({colors: true});
        if(statsString)
            process.stdout.write(statsString + "\n");
    }
    console.log('====================================================')



    if(fs.existsSync(outfile)){
      subProcess = fork(outfile)
    }
    
})