const path = require('path');
const npxDir = path.resolve(process.env.LOCALAPPDATA, 'npm-cache/_npx/32ff46223dc23804/node_modules');
let cliDir;
let ma;

try {
  ma = require('module-alias');
  cliDir = path.dirname(require.resolve('@zeppos/zeus-cli/package.json'));
} catch (e) {
  ma = require(path.join(npxDir, 'module-alias'));
  cliDir = path.join(npxDir, '@zeppos/zeus-cli');
}

ma(cliDir);
require(path.join(cliDir, 'bin/main.js'));
