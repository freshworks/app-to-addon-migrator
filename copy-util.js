#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [util-name] [engine-name] [util-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('./logging');

const { dryRun } = argv;
const utilPath = 'app/utils';
const packagePath = 'packages/engines';

const [utilName, engineName, utilFolder] = argv._;

// Moving util.js
log('Moving util.js');
log('---------------');
const sourceutil = utilFolder ? `${utilPath}/${utilFolder}/${utilName}.js`
  : `${utilPath}/${utilName}.js`;
const destutil = `${packagePath}/${engineName}/addon/utils/${utilName}.js`;

log(sourceutil);
log(destutil);

if (!dryRun) {
  fse.copy(sourceutil, destutil)
    .then(() => {
      ok(`Success: util ${utilName}.js copied`);
    })
    .catch((err) => error(err));
}

// Moving util tests
log('\nMoving util tests');
log('------------------');
const sourceTest = utilFolder ? `tests/unit/utils/${utilFolder}/${utilName}-test.js`
  : `tests/unit/utils/${utilName}-test.js`;
const destTest = `${packagePath}/${engineName}/tests/unit/utils/${utilName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: util Test ${utilName}.hbs copied`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no unit tests for util ${utilName}`);
  }
}

// Create util assets to app folder in addon

log('\nCreating util assets in app folder ');
log('----------------------------------- ');

const apputil = `${packagePath}/${engineName}/app/utils/${utilName}.js`;
const utilBody = `export { default } from '${engineName}/utils/${utilName}';`;
log(apputil);
if (!dryRun) {
  fse.outputFile(apputil, utilBody)
    .then(() => {
      ok(`Success: util ${utilName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}
