/**
 * AryaMehr Calendar - Zero-Dependency Persian Reshaper & Cursive Joining Engine
 * Maps Arabic/Persian characters into connected Unicode Presentation Forms
 * for Zepp OS text widgets in natural reading order (no string inversion).
 */

// [Isolated, Final, Initial, Medial]
const GLYPH_MAP: Record<number, [number, number, number, number]> = {
  // Alef with madda
  0x0622: [0xFE81, 0xFE82, 0xFE81, 0xFE82],
  // Alef with hamza above
  0x0623: [0xFE83, 0xFE84, 0xFE83, 0xFE84],
  // Waw with hamza
  0x0624: [0xFE85, 0xFE86, 0xFE85, 0xFE86],
  // Alef with hamza below
  0x0625: [0xFE87, 0xFE88, 0xFE87, 0xFE88],
  // Yeh with hamza
  0x0626: [0xFE89, 0xFE8A, 0xFBFE, 0xFBFF],
  // Alef
  0x0627: [0xFE8D, 0xFE8E, 0xFE8D, 0xFE8E],
  // Beh
  0x0628: [0xFE8F, 0xFE90, 0xFE91, 0xFE92],
  // Teh Marbuta
  0x0629: [0xFE93, 0xFE94, 0xFE93, 0xFE94],
  // Teh
  0x062A: [0xFE95, 0xFE96, 0xFE97, 0xFE98],
  // Theh
  0x062B: [0xFE99, 0xFE9A, 0xFE9B, 0xFE9C],
  // Jeem
  0x062C: [0xFE9D, 0xFE9E, 0xFE9F, 0xFEA0],
  // Hah
  0x062D: [0xFEA1, 0xFEA2, 0xFEA3, 0xFEA4],
  // Khah
  0x062E: [0xFEA5, 0xFEA6, 0xFEA7, 0xFEA8],
  // Dal
  0x062F: [0xFEA9, 0xFEAA, 0xFEA9, 0xFEAA],
  // Thal
  0x0630: [0xFEAB, 0xFEAC, 0xFEAB, 0xFEAC],
  // Reh
  0x0631: [0xFEAD, 0xFEAE, 0xFEAD, 0xFEAE],
  // Zain
  0x0632: [0xFEAF, 0xFEB0, 0xFEAF, 0xFEB0],
  // Seen
  0x0633: [0xFEB1, 0xFEB2, 0xFEB3, 0xFEB4],
  // Sheen
  0x0634: [0xFEB5, 0xFEB6, 0xFEB7, 0xFEB8],
  // Sad
  0x0635: [0xFEB9, 0xFEBA, 0xFEBB, 0xFEBC],
  // Dad
  0x0636: [0xFEBD, 0xFEBE, 0xFEBF, 0xFEC0],
  // Tah
  0x0637: [0xFEC1, 0xFEC2, 0xFEC3, 0xFEC4],
  // Zah
  0x0638: [0xFEC5, 0xFEC6, 0xFEC7, 0xFEC8],
  // Ain
  0x0639: [0xFEC9, 0xFECA, 0xFECB, 0xFECC],
  // Ghain
  0x063A: [0xFECD, 0xFECE, 0xFECF, 0xFED0],
  // Feh
  0x0641: [0xFED1, 0xFED2, 0xFED3, 0xFED4],
  // Qaf
  0x0642: [0xFED5, 0xFED6, 0xFED7, 0xFED8],
  // Kaf (Arabic)
  0x0643: [0xFED9, 0xFEDA, 0xFEDB, 0xFEDC],
  // Lam
  0x0644: [0xFEDD, 0xFEDE, 0xFEDF, 0xFEE0],
  // Meem
  0x0645: [0xFEE1, 0xFEE2, 0xFEE3, 0xFEE4],
  // Noon
  0x0646: [0xFEE5, 0xFEE6, 0xFEE7, 0xFEE8],
  // Heh
  0x0647: [0xFEE9, 0xFEEA, 0xFEEB, 0xFEEC],
  // Waw
  0x0648: [0xFEED, 0xFEEE, 0xFEED, 0xFEEE],
  // Yeh (Arabic)
  0x064A: [0xFEF1, 0xFEF2, 0xFEF3, 0xFEF4],

  // Persian specific characters:
  // Pe (پ)
  0x067E: [0xFB56, 0xFB57, 0xFB58, 0xFB59],
  // Tche / Che (چ)
  0x0686: [0xFB7A, 0xFB7B, 0xFB7C, 0xFB7D],
  // Zhe (ژ)
  0x0698: [0xFB8A, 0xFB8B, 0xFB8A, 0xFB8B],
  // Keheh / Ke (ک)
  0x06A9: [0xFB8E, 0xFB8F, 0xFB90, 0xFB91],
  // Gaf (گ)
  0x06AF: [0xFB92, 0xFB93, 0xFB94, 0xFB95],
  // Farsi Yeh (ی)
  0x06CC: [0xFBFC, 0xFBFD, 0xFBFE, 0xFBFF],
};

// Lam-Alef Ligatures: [Isolated, Final]
const LAM_ALEF_MAP: Record<number, [number, number]> = {
  0x0622: [0xFEF5, 0xFEF6], // آ
  0x0623: [0xFEF7, 0xFEF8], // أ
  0x0625: [0xFEF9, 0xFEFA], // إ
  0x0627: [0xFEFB, 0xFEFC], // ا
};

// Non-connecting letters (only connect backwards to preceding letter, never forward)
const NON_FORWARD_CONNECTORS = new Set([
  0x0622, 0x0623, 0x0624, 0x0625, 0x0627, 0x062F, 0x0630, 0x0631, 0x0632,
  0x0648, 0x0698,
]);

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w] ?? w);
}

/**
 * Reshapes a single Persian/Arabic word into connected cursive forms in natural forward reading order.
 */
function reshapeWord(word: string): string {
  const codes: number[] = [];
  for (let i = 0; i < word.length; i++) {
    codes.push(word.charCodeAt(i));
  }

  const result: string[] = [];
  const len = codes.length;

  for (let i = 0; i < len; i++) {
    const code = codes[i];

    // Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله)
    if (code === 0x200C) {
      continue;
    }

    // Check for Lam-Alef ligature
    if (code === 0x0644 && i < len - 1 && LAM_ALEF_MAP[codes[i + 1]]) {
      const alefCode = codes[i + 1];
      const prevCode = i > 0 ? codes[i - 1] : 0;
      const connectsBack =
        prevCode !== 0 &&
        GLYPH_MAP[prevCode] &&
        !NON_FORWARD_CONNECTORS.has(prevCode) &&
        prevCode !== 0x200C;

      const lig = LAM_ALEF_MAP[alefCode];
      result.push(String.fromCharCode(connectsBack ? lig[1] : lig[0]));
      i++; // Skip the following alef
      continue;
    }

    const glyphs = GLYPH_MAP[code];
    if (!glyphs) {
      result.push(word[i]);
      continue;
    }

    const prevCode = i > 0 ? codes[i - 1] : 0;
    const nextCode = i < len - 1 ? codes[i + 1] : 0;

    const connectsBack =
      prevCode !== 0 &&
      GLYPH_MAP[prevCode] &&
      !NON_FORWARD_CONNECTORS.has(prevCode) &&
      prevCode !== 0x200C;

    const connectsForward =
      nextCode !== 0 &&
      (GLYPH_MAP[nextCode] || (nextCode === 0x0644 && LAM_ALEF_MAP[codes[i + 2]])) &&
      !NON_FORWARD_CONNECTORS.has(code) &&
      nextCode !== 0x200C;

    let formIndex = 0; // Isolated by default
    if (connectsBack && connectsForward) {
      formIndex = 3; // Medial
    } else if (connectsForward) {
      formIndex = 2; // Initial
    } else if (connectsBack) {
      formIndex = 1; // Final
    } else {
      formIndex = 0; // Isolated
    }

    result.push(String.fromCharCode(glyphs[formIndex]));
  }

  // NATURAL FORWARD ORDER - DO NOT REVERSE CHARACTERS
  return result.join("");
}

/**
 * Full reshaping for complete sentences and mixed text.
 * Preserves numbers and token order in natural reading sequence.
 */
export function reshape(text: string): string {
  if (!text) return "";

  // Convert Western digits to Persian digits
  const withPersianDigits = toPersianDigits(text);

  // Split into tokens (words, spaces, and punctuation)
  const tokens = withPersianDigits.split(/(\s+|[()،,.:/\\•\-])/);

  const processedTokens = tokens.map((token) => {
    if (!token) return "";
    // If it's numbers or punctuation, preserve untouched
    if (/^[۰-۹0-9\s()،,.:/\\•\-]+$/.test(token)) {
      return token;
    }
    // If it has Arabic/Persian letters, reshape cursive letters
    if (/[\u0600-\u06FF\uFB50-\uFDFF]/.test(token)) {
      return reshapeWord(token);
    }
    return token;
  });

  // NATURAL FORWARD ORDER - DO NOT REVERSE TOKENS
  return processedTokens.join("");
}
