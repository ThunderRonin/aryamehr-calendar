import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import { runInNewContext } from 'node:vm';
import { toGregorian } from '../src/core/jalaali';

const root = 'nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8/';
const provenance = JSON.parse(readFileSync('tests/fixtures/watchface-original.json', 'utf8'));
const source = readFileSync(root + 'watchface/index.js', 'utf8');
const baselineLifecycle = inflateRawSync(
  Buffer.from(provenance.indexLifecycleBaselineDeflateBase64, 'base64'),
).toString('utf8');
const stripMarkedAdditions = (text: string) =>
  text.replace(/^\/\/ ARYAMEHR ADDITION START\r?\n[\s\S]*?^\/\/ ARYAMEHR ADDITION END\r?\n?/gm, '');
const lifecycleStart = '            normal_time_hour_text_font =';
const lifecycleEnd = '                //dynamic modify end';
const currentStart = source.indexOf(lifecycleStart);
const currentEnd = source.indexOf(lifecycleEnd, currentStart);
assert.ok(currentStart >= 0 && currentEnd > currentStart);
const original = stripMarkedAdditions(
  source.slice(0, currentStart) + baselineLifecycle + source.slice(currentEnd),
).replace(/\r?\n$/, '');
const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

test('stripping AryaMehr additions and approved lifecycle normalization preserves original provenance', () => {
  assert.equal(sha256(original), provenance.indexNormalizedSha256);
  const appText = readFileSync(root + 'app.js', 'utf8').replace(/\r?\n/g, '\r\n');
  assert.equal(sha256(appText), provenance.appSha256);
  const config = JSON.parse(readFileSync(root + 'app.json', 'utf8'));
  assert.deepEqual(config.runtime, provenance.runtime);
  assert.deepEqual(config.targets['466x466-gtr-4'].module, provenance.module);
});

test('all original artwork and fonts are unchanged in the device target asset directory', () => {
  for (const [name, hash] of Object.entries(provenance.assets)) {
    assert.equal(sha256(readFileSync(root + 'assets/466x466-gtr-4/' + name)), hash, name);
  }
});

function boot(withWidget = true, firstTimer = 1) {
  const widgets: any[] = [];
  const timers = new Map<number, () => void>();
  const timerCalls: Array<{ id: number; delay: number; repeat: number; callback: () => void; options: any; argc: number }> = [];
  const stoppedTimers: number[] = [];
  const launches: any[] = [];
  const launchPhases: boolean[] = [];
  const errors: any[] = [];
  let nextTimer = firstTimer;
  let screenType = 1;
  let touchCallbackActive = false;
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
    hmSetting: { getScreenType: () => screenType, screen_type: { WATCHFACE: 1, AOD: 2 } },
    hmApp: { startApp: (options: any) => { launches.push(options); launchPhases.push(touchCallbackActive); } },
    timer: {
      createTimer(delay: number, repeat: number, callback: () => void, options: any) {
        const id = nextTimer++;
        timerCalls.push({ id, delay, repeat, callback, options, argc: arguments.length });
        timers.set(id, callback);
        return id;
      },
      stopTimer: (id: number) => { stoppedTimers.push(id); timers.delete(id); },
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
    timerCalls, stoppedTimers,
    launchPhases,
    setDate(date: Date) { now = date; },
    setScreenType(value: number) { screenType = value; },
    setTouchCallbackActive(value: boolean) { touchCallbackActive = value; },
    runTimer(id: number) {
      const call = timerCalls.find(candidate => candidate.id === id);
      if (call && call.repeat <= 1) timers.delete(id);
      timers.get(id)?.();
    },
    tick() {
      for (const [id, callback] of [...timers.entries()]) {
        const call = timerCalls.find(candidate => candidate.id === id);
        if (call && call.repeat <= 1) timers.delete(id);
        callback();
      }
    },
    suspendTimers() { timers.clear(); },
    resumeTimers() {
      for (const call of timerCalls.filter(call => call.repeat > 1)) timers.set(call.id, call.callback);
    },
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
    face.tick();
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

test('the normal clock timer stays alive through a suspended return and updates seconds', () => {
  const face = boot();
  const normalTimer = face.timerCalls.find(call => call.repeat === 1000);
  assert.ok(normalTimer);
  face.setDate(new Date(2026, 8, 6, 12, 15, 31));
  face.delegate.pause_call();
  assert.deepEqual(face.stoppedTimers, [], 'ordinary pause leaves the persistent normal timer to firmware');
  face.suspendTimers();
  face.setDate(new Date(2026, 8, 6, 12, 15, 32));
  face.resumeTimers();
  face.tick();
  const seconds = face.widgets.find(w => w.x === 353 && w.y === 205);
  assert.equal(seconds.text, '32');
  assert.equal(face.timerCalls.filter(call => call.repeat === 1000).length, 1);
});

test('three launch and return cycles keep one normal timer without needing resume to recreate it', () => {
  const face = boot();
  const normalTimerCount = () => face.timerCalls.filter(call => call.repeat === 1000).length;
  for (let cycle = 0; cycle < 3; cycle += 1) {
    face.delegate.pause_call();
    face.setDate(new Date(2026, 8, 6, 12, 16 + cycle, cycle));
    face.tick();
    face.delegate.resume_call();
    assert.equal(normalTimerCount(), 1);
  }
  assert.equal(face.stoppedTimers.length, 0);
});

test('lifecycle callbacks re-evaluate screen type and zero remains a valid timer handle', () => {
  const face = boot(true, 0);
  const normalTimer = face.timerCalls.find(call => call.repeat === 1000);
  assert.equal(normalTimer?.id, 0);
  face.setScreenType(2);
  face.delegate.pause_call();
  face.delegate.resume_call();
  assert.ok(face.timerCalls.some(call => call.repeat === 1000 && call.id === 0));
  assert.equal(face.stoppedTimers.includes(0), false);
  face.setScreenType(1);
  face.delegate.pause_call();
  face.delegate.resume_call();
  assert.equal(face.timerCalls.filter(call => call.id === normalTimer?.id).length, 1);
});

test('deferred AryaMehr launch runs after touch dispatch and coalesces double taps', () => {
  const face = boot();
  const shortcut = face.widgets.find(w => w.kind === 'BUTTON' && w.x === 174);
  assert.ok(shortcut);
  face.setTouchCallbackActive(true);
  shortcut.click_func();
  shortcut.click_func();
  face.setTouchCallbackActive(false);
  assert.equal(face.launches.length, 0);
  face.tick();
  assert.equal(face.launches.length, 1);
  assert.equal(face.launchPhases[0], false);
  shortcut.click_func();
  face.tick();
  assert.equal(face.launches.length, 2);
});

test('every watchface timer call uses the four argument Zepp timer signature', () => {
  const normal = boot();
  const shortcut = normal.widgets.find(w => w.kind === 'BUTTON' && w.x === 174);
  shortcut.click_func();
  normal.tick();

  const aod = boot();
  aod.setScreenType(2);
  aod.delegate.pause_call();
  aod.delegate.resume_call();

  const calls = [...normal.timerCalls, ...aod.timerCalls];
  assert.ok(calls.some(call => call.repeat === 1000), 'normal and AOD clock timers execute');
  assert.ok(calls.some(call => call.repeat === 0), 'deferred one-shot launch timer executes');
  assert.ok(calls.every(call => call.argc === 4));
});
