const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Compiling TypeScript...');
execSync('npx tsc', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

console.log('Staging compiled JavaScript modules to runtime structure...');
const distDir = path.join(__dirname, '../dist');
const rootDir = path.join(__dirname, '..');

// Copy dist/app.js to ./app.js
if (fs.existsSync(path.join(distDir, 'app.js'))) {
  fs.copyFileSync(path.join(distDir, 'app.js'), path.join(rootDir, 'app.js'));
}

// Ensure shared directory in dist has files from src/shared if needed
const srcSharedDir = path.join(__dirname, '../src/shared');
const distSharedDir = path.join(distDir, 'shared');
if (fs.existsSync(srcSharedDir)) {
  if (!fs.existsSync(distSharedDir)) {
    fs.mkdirSync(distSharedDir, { recursive: true });
  }
  fs.cpSync(srcSharedDir, distSharedDir, { recursive: true, force: true });
}

// Copy directories
['pages', 'widget', 'app-side', 'core', 'ui', 'setting', 'shared'].forEach((dir) => {
  const src = path.join(distDir, dir);
  const dest = path.join(rootDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
});

console.log('TypeScript compilation and staging completed successfully.');
