/**
 * AryaMehr Calendar - Zoroastrian 5 Daily Gahs Astronomical Calculations
 * هاون، رپیتوین، ازیرن، ایویسروثرم، اوشهن
 */

export type GahId = "havan" | "rapithwin" | "uziran" | "aiwisruthrem" | "ushahin";

export interface ZoroastrianGah {
  id: GahId;
  name: string;
  avestanName: string;
  period: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  patron: string;
  meaning: string;
}

export interface ZoroastrianGahsResult {
  havan: ZoroastrianGah;
  rapithwin: ZoroastrianGah;
  uziran: ZoroastrianGah;
  aiwisruthrem: ZoroastrianGah;
  ushahin: ZoroastrianGah;
  allGahs: ZoroastrianGah[];
}

function d2r(d: number): number {
  return (d * Math.PI) / 180;
}

function r2d(r: number): number {
  return (r * 180) / Math.PI;
}

function formatHours(h: number): string {
  h = (h + 24) % 24;
  const hours = Math.floor(h);
  const minutes = Math.floor((h - hours) * 60);
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0")
  );
}

/**
 * Calculates astronomical Gahs for a given date and location.
 */
export function calculateZoroastrianGahs(
  year: number,
  month: number,
  day: number,
  lat = 35.6892,
  lng = 51.389,
  tz = 3.5
): ZoroastrianGahsResult {
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

  const noonHours = 12 + tz - lng / 15 - eot;

  const cosH =
    (Math.sin(d2r(-0.833)) - Math.sin(d2r(lat)) * Math.sin(d2r(delta))) /
    (Math.cos(d2r(lat)) * Math.cos(d2r(delta)));
  const hSun = (cosH > 1 || cosH < -1) ? 6 : r2d(Math.acos(cosH)) / 15;

  const sunriseHours = noonHours - hSun;
  const sunsetHours = noonHours + hSun;
  const midAfternoonHours = noonHours + (sunsetHours - noonHours) * 0.5;
  const midnightHours = (noonHours + 12) % 24;

  const havan: ZoroastrianGah = {
    id: "havan",
    name: "هاوَن گاه",
    avestanName: "Hāvan Gāh",
    period: "طلوع تا نیمروز",
    startTime: formatHours(sunriseHours),
    endTime: formatHours(noonHours),
    patron: "مهر و راما",
    meaning: "نیایش بامدادی، مهر و دوستی، آغاز کوشش و کار",
  };

  const rapithwin: ZoroastrianGah = {
    id: "rapithwin",
    name: "رَپیتوین گاه",
    avestanName: "Rapithwin Gāh",
    period: "نیمروز تا پسین",
    startTime: formatHours(noonHours),
    endTime: formatHours(midAfternoonHours),
    patron: "اردیبهشت و آذر",
    meaning: "نیایش نیمروزی، اوج روشنایی و گرمای راستی",
  };

  const uziran: ZoroastrianGah = {
    id: "uziran",
    name: "اُزیرَن گاه",
    avestanName: "Uziran Gāh",
    period: "پسین تا غروب",
    startTime: formatHours(midAfternoonHours),
    endTime: formatHours(sunsetHours),
    patron: "برز ایزد و آپام‌نپات",
    meaning: "نیایش عصرگاهی، پاسداری از آب‌ها و پایداری",
  };

  const aiwisruthrem: ZoroastrianGah = {
    id: "aiwisruthrem",
    name: "ایویسروثْرِم گاه",
    avestanName: "Aiwisruthrem Gāh",
    period: "غروب تا نیمه‌شب",
    startTime: formatHours(sunsetHours),
    endTime: formatHours(midnightHours),
    patron: "فروهر پاکان و اشوزرتشت",
    meaning: "نیایش شامگاهی، بزرگداشت روان و فروهر نیکان",
  };

  const ushahin: ZoroastrianGah = {
    id: "ushahin",
    name: "اوشَهین گاه",
    avestanName: "Ushahin Gāh",
    period: "نیمه‌شب تا طلوع",
    startTime: formatHours(midnightHours),
    endTime: formatHours(sunriseHours),
    patron: "سروش پاک و رشن",
    meaning: "نیایش سحرگاهی و پگاه، بیداری وجدان و دادگری",
  };

  return {
    havan,
    rapithwin,
    uziran,
    aiwisruthrem,
    ushahin,
    allGahs: [havan, rapithwin, uziran, aiwisruthrem, ushahin],
  };
}

function parseTimeToDecimal(timeStr: string): number {
  const [hh, mm] = timeStr.split(":").map(Number);
  return hh + mm / 60;
}

/**
 * Returns the currently active Gah based on the current hour and minute.
 */
export function getCurrentGah(
  gahs: ZoroastrianGahsResult,
  hours: number,
  minutes: number
): ZoroastrianGah {
  const current = hours + minutes / 60;
  const havanStart = parseTimeToDecimal(gahs.havan.startTime);
  const noon = parseTimeToDecimal(gahs.rapithwin.startTime);
  const midAfternoon = parseTimeToDecimal(gahs.uziran.startTime);
  const sunset = parseTimeToDecimal(gahs.aiwisruthrem.startTime);
  const midnight = parseTimeToDecimal(gahs.ushahin.startTime);

  if (current >= havanStart && current < noon) {
    return gahs.havan;
  }
  if (current >= noon && current < midAfternoon) {
    return gahs.rapithwin;
  }
  if (current >= midAfternoon && current < sunset) {
    return gahs.uziran;
  }

  if (midnight > sunset) {
    if (current >= sunset && current < midnight) {
      return gahs.aiwisruthrem;
    }
  } else {
    if (current >= sunset || current < midnight) {
      return gahs.aiwisruthrem;
    }
  }

  return gahs.ushahin;
}
