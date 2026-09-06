import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { toGregorian } from '../src/core/jalaali';

const root = 'nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8/';
const provenance = JSON.parse(readFileSync('tests/fixtures/watchface-original.json', 'utf8'));
const source = readFileSync(root + 'watchface/index.js', 'utf8');
const original = source.replace(/\/\/ ARYAMEHR ADDITION START\n[\s\S]*?\/\/ ARYAMEHR ADDITION END\n/g, '');
const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

test('removing only the marked widget additions recovers the exact original watchface', () => {
  assert.equal(sha256(original), provenance.indexNormalizedSha256);
  assert.equal(sha256(readFileSync(root + 'app.js')), provenance.appSha256);
  const config = JSON.parse(readFileSync(root + 'app.json', 'utf8'));
  assert.deepEqual(config.runtime, provenance.runtime);
  assert.deepEqual(config.targets['466x466-gtr-4'].module, provenance.module);
});

test('all original artwork and fonts are unchanged in the device target asset directory', () => {
  for (const [name, hash] of Object.entries(provenance.assets)) {
    assert.equal(sha256(readFileSync(root + 'assets/466x466-gtr-4/' + name)), hash, name);
  }
});

function boot(withWidget = true) {
  const widgets: any[] = [];
  const timers = new Map<number, () => void>();
  const launches: any[] = [];
  const errors: any[] = [];
  let nextTimer = 1;
  let now = new Date(2026, 8, 6, 12, 15, 30);
  const names = new Proxy({}, { get: (_, key) => key });
  const page: any = {};
  const sensor = {
    event: names, addEventListener() {}, getForecastWeather: () => ({ cityName: 'Tehran' }),
    get year() { return now.getFullYear(); }, get month() { return now.getMonth() + 1; },
    get day() { return now.getDate(); }, get week() { return now.getDay() || 7; },
    get hour() { return now.getHours(); }, get format_hour() { return now.getHours(); },
    get minute() { return now.getMinutes(); }, get second() { return now.getSeconds(); },
  };
  const runtime = {
    __$$hmAppManager$$__: { currentApp: { current: page, __globals__: {} } },
    DeviceRuntimeCore: {
      WidgetFactory: function () {}, HmDomApi: function () {},
      HmLogger: { getLogger: () => ({ log() {} }) }, WatchFace: (x: any) => x,
    },
    hmUI: {
      widget: names, prop: names, align: names, text_style: names,
      data_type: names, system_status: names, show_level: { ONLY_NORMAL: 1, ONLY_AOD: 2 },
      createWidget(kind: string, options: any) {
        const widget = {
          ...options, kind, setAlpha() {}, addEventListener() {},
          setProperty(key: string, value: any) { this[key.toLowerCase()] = value; },
        };
        widgets.push(widget);
        return widget;
      },
    },
    hmSensor: { id: names, createSensor: () => sensor },
    hmSetting: { getScreenType: () => 1, screen_type: { WATCHFACE: 1, AOD: 2 } },
    hmApp: { startApp: (options: any) => launches.push(options) },
    timer: {
      createTimer(_delay: number, _repeat: number, callback: () => void) {
        const id = nextTimer++;
        timers.set(id, callback);
        return id;
      },
      stopTimer: (id: number) => timers.delete(id),
    },
    console: { log(...args: any[]) { if (/error/i.test(args.join(' '))) errors.push(args); } },
  };
  const helper = readFileSync(root + 'watchface/aryamehr-widget.js', 'utf8')
    .replace('export function createAryaMehrWidget', 'function createAryaMehrWidget');
  runInNewContext(withWidget
    ? helper + '\n' + source.replace(/^import .*;$/m, '')
    : original, runtime);
  page.module.build();
  const delegate = widgets.find(w => w.kind === 'WIDGET_DELEGATE');
  delegate.resume_call();
  assert.deepEqual(errors, []);
  return {
    widgets, timers, launches, errors, delegate,
    setDate(date: Date) { now = date; },
    tick() { for (const callback of timers.values()) callback(); },
  };
}

test('widget leaves every original widget, clock update and native shortcut intact', () => {
  const baseline = boot(false);
  const enhanced = boot();
  const added = enhanced.widgets.filter(w => w.x === 174 && (w.y === 354 || w.y === 376));
  assert.equal(added.length, 3);
  const native = () => enhanced.widgets.filter(w => !added.includes(w));
  const snapshot = (widgets: any[]) => JSON.parse(JSON.stringify(widgets));
  assert.deepEqual(snapshot(native()), snapshot(baseline.widgets));
  for (const face of [baseline, enhanced]) {
    for (let i = 0; i < 3; i++) {
      face.delegate.pause_call();
      face.setDate(new Date(2026, 8, 6, 12, 16 + i, 0));
      face.delegate.resume_call();
      face.tick();
    }
    for (const button of face.widgets.filter(w => w.kind === 'BUTTON' && w.x !== 174)) {
      button.click_func();
    }
    assert.deepEqual(face.errors, []);
  }
  assert.deepEqual(snapshot(native()), snapshot(baseline.widgets));
  assert.deepEqual(snapshot(enhanced.launches), snapshot(baseline.launches));
  assert.equal(enhanced.timers.size, baseline.timers.size, 'widget adds no timer');
});

test('AryaMehr date updates across Persian month/year boundaries without replacing Gregorian date', () => {
  const face = boot();
  for (const [jy, jm, jd, month] of [[1403, 12, 30, 'ESF'], [1404, 1, 1, 'FAR'], [1405, 6, 15, 'SHAH']] as const) {
    const g = toGregorian(jy, jm, jd);
    face.setDate(new Date(g.gy, g.gm - 1, g.gd, 12, 0, 0));
    face.tick();
    assert.equal(face.widgets.find(w => w.x === 174 && w.y === 354 && w.kind === 'TEXT').text, String(jd));
    assert.equal(face.widgets.find(w => w.x === 174 && w.y === 376).text, month);
    assert.equal(face.widgets.find(w => w.x === 234 && w.y === 163 && w.show_level === 1).text,
      String(g.gm).padStart(2, '0'));
    assert.equal(face.widgets.find(w => w.x === 112 && w.y === 163 && w.show_level === 1).text,
      String(g.gd).padStart(2, '0'));
  }
});

test('only the added heart-rate-adjacent shortcut opens AryaMehr on repeated taps', () => {
  const face = boot();
  const shortcut = face.widgets.find(w => w.kind === 'BUTTON' && w.x === 174);
  assert.equal(shortcut.y, 354);
  for (let i = 0; i < 3; i++) {
    shortcut.click_func();
    face.delegate.pause_call();
    face.delegate.resume_call();
  }
  assert.equal(face.launches.length, 3);
  for (const call of face.launches) {
    assert.equal(call.appid, 20260901);
    assert.equal(call.url, 'pages/today/index.page');
  }
  for (const text of face.widgets.filter(w => w.x === 174 && w.kind === 'TEXT')) {
    assert.equal(text.show_level, 3, 'date is visible in normal and AOD modes');
  }
});
