export type Registrant = {
  bib: string;
  name: string;
  country: string;
  quota: string;
};

export type RegistrantsPage = {
  total: number | null;
  registrants: Registrant[];
  /** French country name → alpha-2, from the page search form. */
  countryCodes: Map<string, string>;
};

export const REGISTRANTS_PAGE_SIZE = 50;

const NAMED_ENTITIES: Record<string, string> = {
  acirc: 'â',
  agrave: 'à',
  amp: '&',
  apos: "'",
  ccedil: 'ç',
  eacute: 'é',
  ecirc: 'ê',
  egrave: 'è',
  euml: 'ë',
  gt: '>',
  icirc: 'î',
  iuml: 'ï',
  lt: '<',
  nbsp: ' ',
  ocirc: 'ô',
  quot: '"',
  ucirc: 'û',
  ugrave: 'ù',
  uuml: 'ü',
};

export function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(parseInt(code.slice(2), 16));
    }
    if (code.startsWith('#')) {
      return String.fromCodePoint(parseInt(code.slice(1), 10));
    }
    const lower = NAMED_ENTITIES[code.toLowerCase()];
    if (lower === undefined) {
      return entity;
    }
    return code.charAt(0) === code.charAt(0).toUpperCase()
      ? lower.toUpperCase()
      : lower;
  });
}

function clean(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

const ROW_PATTERN =
  /<span class="number">([\s\S]*?)<\/span>\s*<span class="title">([\s\S]*?)<\/span>\s*<span class="country">([\s\S]*?)<\/span>\s*<span class="country">([\s\S]*?)<\/span>/g;

/** One page of the official registrants list, header row left out. */
export function parseRegistrantsPage(html: string): RegistrantsPage {
  const registrants = [...html.matchAll(ROW_PATTERN)]
    .map(([, bib, name, country, quota]) => ({
      bib: clean(bib ?? ''),
      name: clean(name ?? ''),
      country: clean(country ?? ''),
      quota: clean(quota ?? ''),
    }))
    .filter((row) => /^\d+$/.test(row.bib));
  const totalMatch = /<strong>\s*([\d\s.]+)\s*coureurs?\s*<\/strong>/i.exec(
    html,
  );
  const select = /<select name="pays"[\s\S]*?<\/select>/.exec(html)?.[0] ?? '';
  const countryCodes = new Map(
    [
      ...select.matchAll(/<option\s+value='([A-Z]{2})'\s*>([^<]+)<\/option>/g),
    ].map(([, code, label]) => [clean(label ?? ''), code ?? '']),
  );
  return {
    total: totalMatch?.[1] ? Number(totalMatch[1].replace(/[\s.]/g, '')) : null,
    registrants,
    countryCodes,
  };
}

export function registrantsPageUrl(
  baseUrl: string,
  raceType: string,
  offset: number,
): string {
  const url = new URL(baseUrl);
  url.searchParams.set('type_course', raceType);
  if (offset > 0) {
    url.searchParams.set('debut_inscrits', String(offset));
  }
  return url.toString();
}
