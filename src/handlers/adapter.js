module.exports.handler = function (options) {
  const fs = require('fs');
  const fse = require('fs-extra');
  const path = require('path');
  const { log, ok, warning } = require('../utils/logging');

  const { adapterName, destination, adapterFolder, dryRun } = options;

  const adapterPath = 'app/adapters';
  const packagePath = path.join('.', destination) || 'packages/engines';

  // Moving adapter.js
  log('Moving adapter.js');
  log('---------------');
  const sourceadapter = adapterFolder
    ? `${adapterPath}/${adapterFolder}/${adapterName}.js`
    : `${adapterPath}/${adapterName}.js`;
  const destadapter = `${packagePath}/addon/adapters/${adapterName}.js`;

  log(sourceadapter);
  log(destadapter);

  if (!dryRun) {
    fse.copySync(sourceadapter, destadapter);
    ok(`Success: Adapter ${adapterName}.js copied`);
  }

  // Moving adapter tests
  log('\nMoving adapter tests');
  log('------------------');
  const sourceTest = adapterFolder
    ? `tests/unit/adapters/${adapterFolder}/${adapterName}-test.js`
    : `tests/unit/adapters/${adapterName}-test.js`;
  const destTest = `${packagePath}/tests/unit/adapters/${adapterName}-test.js`;

  log(sourceTest);
  log(destTest);
  if (!dryRun) {
    if (fs.existsSync(sourceTest)) {
      fse.copySync(sourceTest, destTest);
      ok(`Success: Adapter Test ${adapterName} copied`);
    } else {
      warning(`WARNING: There are no unit tests for adapter ${adapterName}`);
    }
  }

  // Create adapter assets to app folder in addon

  log('\nCreating adapter assets in app folder ');
  log('----------------------------------- ');

  const appadapter = `${packagePath}/app/adapters/${adapterName}.js`;
  const addonName = path.basename(destination);
  const adapterBody = `export { default } from '${addonName}/adapters/${adapterName}';`;
  log(appadapter);
  if (!dryRun) {
    fse.outputFileSync(appadapter, adapterBody);
    ok(`Success: Adapter ${adapterName}.js created in app`);
  }
};
