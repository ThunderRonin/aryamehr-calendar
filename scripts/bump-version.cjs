const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const appJsonPath = path.join(rootDir, 'app.json');

const bumpType = (process.argv[2] || 'patch').toLowerCase();

if (!fs.existsSync(pkgPath) || !fs.existsSync(appJsonPath)) {
  console.error('Error: package.json or app.json not found');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const oldVersion = pkg.version || '1.0.0';
const versionParts = oldVersion.split('.').map((p) => parseInt(p, 10) || 0);
while (versionParts.length < 3) versionParts.push(0);

let [major, minor, patch] = versionParts;

if (bumpType === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (bumpType === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const newVersion = `${major}.${minor}.${patch}`;

const oldCode = (appJson.app && appJson.app.version && appJson.app.version.code) || 1;
const newCode = oldCode + 1;

pkg.version = newVersion;

if (!appJson.app) appJson.app = {};
if (!appJson.app.version) appJson.app.version = {};
appJson.app.version.code = newCode;
appJson.app.version.name = newVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n', 'utf8');

console.log(`Successfully bumped version: ${oldVersion} -> ${newVersion} (code: ${oldCode} -> ${newCode})`);

