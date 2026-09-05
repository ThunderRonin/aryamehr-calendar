/**
 * AryaMehr Calendar - Astronomical Prayer Times Engine
 * Calculation method: Institute of Geophysics, University of Tehran
 * Fajr: 17.7 degrees, Maghrib: 4.5 degrees
 */

export interface PrayerTimes {
  fajr: string; // اذان صبح
  sunrise: string; // طلوع آفتاب
  dhuhr: string; // اذان ظهر
  sunset: string; // غروب آفتاب
  maghrib: string; // اذان مغرب
}

export interface CityCoords {
  name: string;
  lat: number;
  lng: number;
}

export const MAJOR_CITIES: readonly CityCoords[] = [
  { name: "تهران", lat: 35.6892, lng: 51.389 },
  { name: "مشهد", lat: 36.2605, lng: 59.6168 },
  { name: "اصفهان", lat: 32.6546, lng: 51.668 },
  { name: "شیراز", lat: 29.5918, lng: 52.5837 },
  { name: "تبریز", lat: 38.0962, lng: 46.2738 },
  { name: "اهواز", lat: 31.3183, lng: 48.6706 },
  { name: "رشت", lat: 37.2808, lng: 49.5832 },
  { name: "کرمان", lat: 30.2839, lng: 57.0834 },
  { name: "یزد", lat: 31.8974, lng: 54.3569 },
];

function d2r(d: number): number {
  return (d * Math.PI) / 180;
}

function r2d(r: number): number {
  return (r * 180) / Math.PI;
}

export function calculatePrayerTimes(
  year: number,
  month: number,
  day: number,
  lat = 35.6892,
  lng = 51.389,
  tz = 3.5
): PrayerTimes {
  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  const d = jd - 2451545.0;

  const L = (280.46 + 0.9856474 * d) % 360;
  const M = (357.528 + 0.9856003 * d) % 360;
  const lambda =
    L + 1.915 * Math.sin(d2r(M)) + 0.02 * Math.sin(d2r(2 * M));
  const eps = 23.439 - 0.0000004 * d;

  const sinAlpha = Math.cos(d2r(eps)) * Math.sin(d2r(lambda));
  const cosAlpha = Math.cos(d2r(lambda));
  let alpha = r2d(Math.atan2(sinAlpha, cosAlpha));
  alpha = (alpha + 360) % 360;

  const delta = r2d(Math.asin(Math.sin(d2r(eps)) * Math.sin(d2r(lambda))));
  let eot = (L - alpha) / 15;
  while (eot < -1) eot += 24;
  while (eot > 1) eot -= 24;

  const noon = 12 + tz - lng / 15 - eot;

  function getHourAngle(angle: number): number {
    const cosH =
      (Math.sin(d2r(angle)) - Math.sin(d2r(lat)) * Math.sin(d2r(delta))) /
      (Math.cos(d2r(lat)) * Math.cos(d2r(delta)));
    if (cosH > 1 || cosH < -1) return 0;
    return r2d(Math.acos(cosH)) / 15;
  }

  const hSun = getHourAngle(-0.833);
  const hFajr = getHourAngle(-17.7);
  const hMaghrib = getHourAngle(-4.5);

  function formatTime(h: number): string {
    h = (h + 24) % 24;
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0")
    );
  }

  return {
    fajr: formatTime(noon - hFajr),
    sunrise: formatTime(noon - hSun),
    dhuhr: formatTime(noon),
    sunset: formatTime(noon + hSun),
    maghrib: formatTime(noon + hMaghrib),
  };
}
