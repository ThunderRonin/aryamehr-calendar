const path = require('path');
const { spawnSync } = require('child_process');

const watchfaceDir = path.join(__dirname, '../nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8');
const zeusScript = path.join(__dirname, 'zeus.cjs');

console.log('Building AryaMehr Enhanced Watchface...');
const res = spawnSync('node', [zeusScript, 'build'], {
  cwd: watchfaceDir,
  stdio: 'inherit',
  shell: true,
});

process.exit(res.status || 0);
