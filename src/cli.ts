import { exec, fork, ChildProcess, spawn } from 'child_process';
import * as path from 'path';
import * as webpack from 'webpack';
import * as fs from 'fs';
import { CliOptions } from './interfaces';
import { makeWebpackConfig } from './webpack-config';
import { log } from './logger';
import * as commandLineArgs from 'command-line-args';

const commandOptionDefinitions: commandLineArgs.OptionDefinition[] = [
  { name: 'command', defaultOption: true }
]
const commandOptions = commandLineArgs(commandOptionDefinitions, { stopAtFirstUnknown: true } as any)
const argv = commandOptions._unknown || []

const cliOptionDefinitions: commandLineArgs.OptionDefinition[] = [
  { name: 'prod', type: Boolean, defaultValue: false },
  { name: 'dev', type: Boolean, defaultValue: true },
]
const cliOptions = commandLineArgs(cliOptionDefinitions, { argv })

const cwd = process.cwd();

const configFile: CliOptions = JSON.parse(fs.readFileSync(path.join(cwd, '.ts-cli.json')).toString());


if (commandOptions.command === 'serve') {

  const outfilePath = path.join(cwd, configFile.outputPath);
  const outfile = path.join(outfilePath, 'bundle.js');

  const webpackConfig = makeWebpackConfig(configFile, outfilePath);

  const compiler = webpack(webpackConfig);

  let subProcess: ChildProcess;
  let lastHash: string = null;

  compiler.watch({}, (err, stats) => {

    if (err) {
      // Do not keep cache anymore
      //compiler.purgeInputFileSystem();
    }
    if (err) {
      lastHash = null;
      console.error(err.stack || err);
      if (err['details']) {
        console.error('really bad error', err['details']);
      }
      process.exitCode = 1;
      return;
    }
    if (stats['hash'] !== lastHash) {
      lastHash = stats['hash'];
      var statsString = stats.toString({ colors: true });

      if (statsString){
        log(statsString + '\n', 'webpack')
      }
    }

    if (fs.existsSync(outfile)) {
      //subProcess = spawn('node', ['--inspect', outfile], { stdio: 'pipe' });
      if(subProcess){
        subProcess.kill('SIGINT');
      }
      subProcess = fork(outfile, [], {
        execArgv: ['--inspect']
      });
    }
  });
}


