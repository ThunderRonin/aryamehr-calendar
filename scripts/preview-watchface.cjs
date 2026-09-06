const path = require('path');
const { spawnSync } = require('child_process');

const watchfaceDir = path.join(__dirname, '../nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8');
const zeusScript = path.join(__dirname, 'zeus.cjs');

console.log('Starting preview server for AryaMehr Enhanced Watchface...');
console.log('Open Zepp app on iPhone > Profile > Developer Mode > scan QR code to install.\n');

const res = spawnSync('node', [zeusScript, 'preview'], {
  cwd: watchfaceDir,
  stdio: 'inherit',
  shell: true,
});

process.exit(res.status || 0);
