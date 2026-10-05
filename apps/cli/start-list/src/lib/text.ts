const PARTICLES = new Set([
  'da',
  'das',
  'de',
  'del',
  'della',
  'den',
  'der',
  'des',
  'di',
  'do',
  'dos',
  'du',
  'e',
  'la',
  'le',
  'van',
  'von',
  'y',
]);

export function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/** Lowercase, accent-free words, hyphens and apostrophes split: "Jean-Marc N'Diaye" → jean marc n diaye. */
export function nameTokens(value: string): string[] {
  return stripAccents(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function sameTokens(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((token, index) => token === right[index]);
}

function capitalize(segment: string): string {
  const lower = segment.toLocaleLowerCase('fr');
  return lower.charAt(0).toLocaleUpperCase('fr') + lower.slice(1);
}

function formatWord(word: string, isFirst: boolean): string {
  const lower = word.toLocaleLowerCase('fr');
  if (!isFirst && PARTICLES.has(stripAccents(lower))) {
    return lower;
  }
  return word
    .split(/([-'’])/)
    .map((segment) => (/^[-'’]$/.test(segment) ? segment : capitalize(segment)))
    .join('');
}

/** "PUPPI" → "Puppi", "JEAN-MARC" → "Jean-Marc", "VAN DER BERG" → "Van der Berg". */
export function formatNamePart(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => formatWord(word, index === 0))
    .join(' ');
}

function isUppercaseWord(word: string): boolean {
  return /\p{L}/u.test(word) && word === word.toLocaleUpperCase('fr');
}

/** UTMB writes "Firstname LASTNAME": the trailing uppercase words are the last name. */
export function splitUtmbFullname(fullname: string): {
  firstName: string;
  lastName: string;
} {
  const words = fullname.trim().split(/\s+/).filter(Boolean);
  const lastNameStart = words.findIndex((_, index) =>
    words.slice(index).every(isUppercaseWord),
  );
  const splitAt =
    lastNameStart > 0 ? lastNameStart : Math.min(1, words.length - 1);
  return {
    firstName: formatNamePart(words.slice(0, splitAt).join(' ')),
    lastName: formatNamePart(words.slice(splitAt).join(' ')),
  };
}
