// Solar Hijri date for the added AryaMehr shortcut only.
const JALAALI_BREAKS = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
    1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
];
function jdiv(a, b) { return ~~(a / b); }
function jmod(a, b) { return a - ~~(a / b) * b; }
function jalCalCore(jy) {
    const gy = jy + 621;
    let leapJ = -14;
    let jp = JALAALI_BREAKS[0];
    let jump = 0;
    let jm = 0;
    for (let i = 1; i < JALAALI_BREAKS.length; i += 1) {
        jm = JALAALI_BREAKS[i];
        jump = jm - jp;
        if (jy < jm) break;
        leapJ = leapJ + jdiv(jump, 33) * 8 + jdiv(jmod(jump, 33), 4);
        jp = jm;
    }
    const n = jy - jp;
    leapJ = leapJ + jdiv(n, 33) * 8 + jdiv(jmod(n, 33) + 3, 4);
    if (jmod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
    const leapG = jdiv(gy, 4) - jdiv((jdiv(gy, 100) + 1) * 3, 4) - 150;
    const march = 20 + leapJ - leapG;
    return { gy, march, jump, n };
}
function leapFromCycle(jump, n) {
    let adjusted = n;
    if (jump - n < 6) adjusted = n - jump + jdiv(jump + 4, 33) * 33;
    let leap = jmod(jmod(adjusted + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;
    return leap;
}
function g2d(gy, gm, gd) {
    let d = jdiv((gy + jdiv(gm - 8, 6) + 100100) * 1461, 4) +
        jdiv(153 * jmod(gm + 9, 12) + 2, 5) + gd - 34840408;
    d = d - jdiv(jdiv(gy + 100100 + jdiv(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
}
function d2g(jdn) {
    let j = 4 * jdn + 139361631;
    j = j + jdiv(jdiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = jdiv(jmod(j, 1461), 4) * 5 + 308;
    const gd = jdiv(jmod(i, 153), 5) + 1;
    const gm = jmod(jdiv(i, 153), 12) + 1;
    const gy = jdiv(j, 1461) - 100100 + jdiv(8 - gm, 6);
    return { gy, gm, gd };
}
function d2j(jdn) {
    const gy = d2g(jdn).gy;
    let jy = Math.min(gy - 621, 3177);
    const r = jalCalCore(jy);
    const jdn1f = g2d(r.gy, 3, r.march);
    let k = jdn - jdn1f;
    if (k >= 0) {
        if (k <= 185) return { jy, jm: 1 + jdiv(k, 31), jd: jmod(k, 31) + 1 };
        k -= 186;
    } else {
        jy -= 1;
        k += 179;
        if (leapFromCycle(r.jump, r.n) === 1) k += 1;
    }
    return { jy, jm: 7 + jdiv(k, 30), jd: jmod(k, 30) + 1 };
}
function toJalaali(gy, gm, gd) {
    return d2j(g2d(gy, gm, gd));
}
const MONTHS = ['FAR', 'ORD', 'KHOR', 'TIR', 'MORD', 'SHAH',
  'MEHR', 'ABAN', 'AZAR', 'DEY', 'BAHM', 'ESF'];

export function createAryaMehrWidget(timeSensor) {
  const normalAndAod = hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_AOD;
  let launchTimer = undefined;
  // The original weather artwork ends at x=168. Three heart-rate digits
  // start near x=250; this small two-line date fits between them.
  const style = {
    // Reuse the original face's preloaded 20px glyph cache. A new 16px
    // dynamic-text size was invisible on the GTR 4 although taps worked.
    x: 174, w: 68, h: 22, text_size: 20,
    font: 'fonts/REGISTER.TTF', color: 0xFF969696,
    align_h: hmUI.align.CENTER_H, align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE, show_level: normalAndAod,
  };
  const day = hmUI.createWidget(hmUI.widget.TEXT, { ...style, y: 354, text: '' });
  const month = hmUI.createWidget(hmUI.widget.TEXT, { ...style, y: 376, text: '' });
  hmUI.createWidget(hmUI.widget.BUTTON, {
    x: 174, y: 354, w: 68, h: 44, text: '',
    normal_src: '0_empty.png', press_src: '0_empty.png',
    show_level: hmUI.show_level.ONLY_NORMAL,
    click_func: function () {
      if (launchTimer !== undefined && launchTimer !== null) return;
      launchTimer = timer.createTimer(1, 0, function () {
        launchTimer = undefined;
        hmApp.startApp({ appid: 20260901, url: 'pages/today/index.page', native: false });
      }, {});
    },
  });
  let lastDate = '';
  function refresh() {
    try {
      const key = timeSensor.year + '-' + timeSensor.month + '-' + timeSensor.day;
      if (key === lastDate) return;
      const date = toJalaali(timeSensor.year, timeSensor.month, timeSensor.day);
      day.setProperty(hmUI.prop.TEXT, String(date.jd));
      month.setProperty(hmUI.prop.TEXT, MONTHS[date.jm - 1]);
      lastDate = key;
    } catch (error) {
      // A widget error must not interrupt the original clock's update loop.
      console.log('AryaMehr widget:', error);
    }
  }
  refresh();
  return refresh;
}
