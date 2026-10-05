import { toAlpha3 } from './countries';
import {
  type ReviewRow,
  type StartListRow,
  toReviewCsv,
  toStartListCsv,
} from './csv';
import {
  REGISTRANTS_PAGE_SIZE,
  type Registrant,
  parseRegistrantsPage,
  registrantsPageUrl,
} from './grandraidList';
import type { HttpClient } from './http';
import {
  type MatchResult,
  type UtmbCandidate,
  matchRunner,
  strongestIndex,
  suggestReviewedCandidate,
} from './matching';
import {
  GRANDRAID_LIST_URL,
  type LiveTrailRunner,
  type LiveTrailSex,
  fetchAllLiveTrailRunners,
  fetchLiveTrailFavorites,
  searchUtmbRunners,
  utmbProfileUrl,
} from './sources';
import {
  formatNamePart,
  nameTokens,
  restoreApostrophes,
  splitListName,
  splitUtmbFullname,
} from './text';

export type OutputFile = { name: string; content: string };

export type FieldSummary = {
  label: string;
  rows: StartListRow[];
  matchedCount: number;
};

export type CommandResult = {
  files: OutputFile[];
  fields: FieldSummary[];
  scannedCount: number;
  unmatchedCount: number;
  reviewCount: number;
  /** Runners matched through the reviewer's accept file. */
  acceptedCount: number;
  /** Doubtful runners left out of every field, with no sex or no full name to tell. */
  leftOutCount: number;
};

type Log = (message: string) => void;

const FIELDS: Array<{
  sex: LiveTrailSex;
  utmbSex: string;
  slug: string;
  label: string;
}> = [
  { sex: 'MALE', utmbSex: 'H', slug: 'hommes', label: 'Hommes' },
  { sex: 'FEMALE', utmbSex: 'F', slug: 'femmes', label: 'Femmes' },
];

/** Strongest index first, then by last name; runners without index come last. */
function byIndexDesc(a: StartListRow, b: StartListRow): number {
  return (
    (b.index ?? -1) - (a.index ?? -1) ||
    a.lastName.localeCompare(b.lastName, 'fr')
  );
}

function describeCandidates(candidates: UtmbCandidate[]): string {
  return candidates
    .map(
      (candidate) =>
        `${candidate.fullname} (${candidate.index ?? '—'}, ${candidate.nationality ?? '?'}, ${candidate.sex ?? '?'}) ${utmbProfileUrl(candidate.uri)}`,
    )
    .join(' | ');
}

function describeDoubt(result: MatchResult): {
  reason: string;
  candidates: UtmbCandidate[];
} {
  switch (result.kind) {
    case 'ambiguous':
      return { reason: 'Homonymes', candidates: result.candidates };
    case 'partial':
      return { reason: 'Nom partiel', candidates: result.candidates };
    case 'none':
      return {
        reason:
          result.nearCandidates.length > 0
            ? 'Nationalité différente'
            : 'Absent d’UTMB',
        candidates: result.nearCandidates,
      };
    case 'match':
      return { reason: 'Sexe inconnu', candidates: [result.candidate] };
  }
}

export type LiveTrailTop = number | 'all';

export type LiveTrailOptions = {
  tenant: string;
  raceId: string;
  /** `all` reads every registered runner instead of the favorites. */
  top: LiveTrailTop;
  filePrefix: string;
  log: Log;
  /** With `all`, only the strongest runners are looked up on UTMB. */
  enrichCount?: number;
};

export const ALL_RUNNERS_ENRICH_COUNT = 50;

function uniqueByBib(runners: LiveTrailRunner[]): LiveTrailRunner[] {
  const seen = new Set<number>();
  return runners.filter((runner) => {
    if (runner.bib === null) {
      return true;
    }
    if (seen.has(runner.bib)) {
      return false;
    }
    seen.add(runner.bib);
    return true;
  });
}

function runnerByIndexThenName(a: LiveTrailRunner, b: LiveTrailRunner): number {
  return (
    (b.index ?? -1) - (a.index ?? -1) ||
    a.lastName.localeCompare(b.lastName, 'fr')
  );
}

/** LiveTrail runners, the strongest linked to their UTMB profile when the match is certain. */
export async function buildFromLiveTrail(
  client: HttpClient,
  {
    tenant,
    raceId,
    top,
    filePrefix,
    log,
    enrichCount = ALL_RUNNERS_ENRICH_COUNT,
  }: LiveTrailOptions,
): Promise<CommandResult> {
  const files: OutputFile[] = [];
  const fields: FieldSummary[] = [];
  let scannedCount = 0;
  let unmatchedCount = 0;
  for (const field of FIELDS) {
    const query = { tenant, raceId, sex: field.sex };
    const runners = uniqueByBib(
      top === 'all'
        ? await fetchAllLiveTrailRunners(client, query)
        : await fetchLiveTrailFavorites(client, { ...query, count: top }),
    ).sort(runnerByIndexThenName);
    const enrichLimit = top === 'all' ? enrichCount : runners.length;
    log(
      `${field.label} : ${runners.length} coureurs LiveTrail, ${Math.min(enrichLimit, runners.length)} cherchés sur UTMB`,
    );
    const rows: StartListRow[] = [];
    let matchedCount = 0;
    for (const [position, runner] of runners.entries()) {
      const name = `${runner.firstName} ${runner.lastName}`;
      let candidate: UtmbCandidate | null = null;
      if (position < enrichLimit) {
        const result = matchRunner(
          { name, nationality: runner.countryCode, index: runner.index },
          await searchUtmbRunners(client, name),
        );
        candidate = result.kind === 'match' ? result.candidate : null;
        if (candidate) {
          matchedCount += 1;
        } else {
          unmatchedCount += 1;
          log(`  sans profil UTMB certain : ${name} (${runner.index ?? '—'})`);
        }
      }
      rows.push({
        firstName: formatNamePart(runner.firstName),
        lastName: formatNamePart(runner.lastName),
        // LiveTrail keeps the registration country, UTMB the runner's nationality.
        nationality:
          toAlpha3(candidate?.nationality) ?? toAlpha3(runner.countryCode),
        index: candidate?.index ?? runner.index,
        utmbUrl: candidate ? utmbProfileUrl(candidate.uri) : null,
      });
    }
    scannedCount += runners.length;
    rows.sort(byIndexDesc);
    fields.push({ label: field.label, rows, matchedCount });
    files.push({
      name: `${filePrefix}-${field.slug}.csv`,
      content: toStartListCsv(rows),
    });
  }
  return {
    files,
    fields,
    scannedCount,
    unmatchedCount,
    reviewCount: 0,
    acceptedCount: 0,
    leftOutCount: 0,
  };
}

export type GrandRaidOptions = {
  raceType: string;
  /** `all` keeps every certain match and sends every other runner to the review file. */
  top: number | 'all';
  filePrefix: string;
  log: Log;
  baseUrl?: string;
  reviewMinIndex?: number;
  /** Reviewed matches: bib → UTMB profile URI, taken before the automatic matching. */
  accepted?: Map<string, string>;
  /** Stops after this many registrants, to try the command quickly. */
  maxRegistrants?: number;
};

async function fetchRegistrants(
  client: HttpClient,
  baseUrl: string,
  raceType: string,
  log: Log,
): Promise<{ registrants: Registrant[]; countryCodes: Map<string, string> }> {
  const first = parseRegistrantsPage(
    await client.getText(registrantsPageUrl(baseUrl, raceType, 0)),
  );
  const total = first.total ?? first.registrants.length;
  const registrants = [...first.registrants];
  for (
    let offset = REGISTRANTS_PAGE_SIZE;
    offset < total;
    offset += REGISTRANTS_PAGE_SIZE
  ) {
    const page = parseRegistrantsPage(
      await client.getText(registrantsPageUrl(baseUrl, raceType, offset)),
    );
    if (page.registrants.length === 0) {
      break;
    }
    registrants.push(...page.registrants);
  }
  const unique = [
    ...new Map(registrants.map((row) => [row.bib, row])).values(),
  ];
  log(`${unique.length} inscrits lus sur ${total} annoncés`);
  return { registrants: unique, countryCodes: first.countryCodes };
}

type Doubt = {
  registrant: Registrant;
  nationality: string | null;
  reason: string;
  candidates: UtmbCandidate[];
  /** Profiles sharing the name: their sex, and their last name to cut the list name. */
  namesakes: UtmbCandidate[];
  suggestion: UtmbCandidate | null;
};

/** "Jean-Marc" → "jean marc" and "jean": a compound first name also tells the sex of its first word. */
function firstNameKeys(firstName: string): string[] {
  const tokens = nameTokens(firstName);
  return [...new Set([tokens.join(' '), tokens[0] ?? ''])].filter(Boolean);
}

function onlyValue<T>(values: Iterable<T>): T | null {
  const unique = new Set(values);
  const [only = null] = unique;
  return unique.size === 1 ? only : null;
}

/**
 * The sex of every UTMB profile sharing the name, else the one the certain matches give this
 * first name. Both known and different: no sex, a profile of the other sex is a wrong homonym.
 */
function guessSex(
  firstName: string,
  candidates: UtmbCandidate[],
  sexesByFirstName: Map<string, Set<string>>,
): string | null {
  const fromCandidates = onlyValue(
    candidates.map((candidate) => candidate.sex),
  );
  const fromFirstName =
    firstNameKeys(firstName)
      .map((key) => onlyValue(sexesByFirstName.get(key) ?? []))
      .find((sex) => sex !== null) ?? null;
  if (fromCandidates && fromFirstName && fromCandidates !== fromFirstName) {
    return null;
  }
  return fromCandidates ?? fromFirstName;
}

/**
 * Official registrants, each looked up on UTMB, strongest index first. A doubtful match leaves
 * the runner without index, in the field its namesakes or its first name tell.
 */
export async function buildFromGrandRaid(
  client: HttpClient,
  {
    raceType,
    top,
    filePrefix,
    log,
    baseUrl = GRANDRAID_LIST_URL,
    reviewMinIndex = 700,
    accepted = new Map<string, string>(),
    maxRegistrants,
  }: GrandRaidOptions,
): Promise<CommandResult> {
  const { registrants, countryCodes } = await fetchRegistrants(
    client,
    baseUrl,
    raceType,
    log,
  );
  const scanned = maxRegistrants
    ? registrants.slice(0, maxRegistrants)
    : registrants;
  const lookups: Array<{
    registrant: Registrant;
    nationality: string | null;
    candidates: UtmbCandidate[];
    result: MatchResult;
  }> = [];
  for (const [position, registrant] of scanned.entries()) {
    const nationality = countryCodes.get(registrant.country) ?? null;
    const candidates = await searchUtmbRunners(client, registrant.name);
    const result = matchRunner(
      { name: registrant.name, nationality },
      candidates,
    );
    lookups.push({ registrant, nationality, candidates, result });
    if ((position + 1) % 100 === 0) {
      log(`${position + 1}/${scanned.length} inscrits cherchés sur UTMB`);
    }
  }
  const matchCountByUri = new Map<string, number>();
  for (const { result } of lookups) {
    if (result.kind === 'match') {
      const uri = result.candidate.uri;
      matchCountByUri.set(uri, (matchCountByUri.get(uri) ?? 0) + 1);
    }
  }

  const rowsBySex = new Map<string, Map<string, StartListRow>>();
  const addRow = (sex: string, key: string, row: StartListRow) => {
    const rows = rowsBySex.get(sex) ?? new Map<string, StartListRow>();
    rowsBySex.set(sex, rows.set(key, row));
  };
  const sexesByFirstName = new Map<string, Set<string>>();
  const doubts: Doubt[] = [];
  let acceptedCount = 0;
  for (const { registrant, nationality, candidates, result } of lookups) {
    // Namesakes of the list both match the strongest profile: at most one of them is that runner.
    const sharedCandidate =
      result.kind === 'match' &&
      (matchCountByUri.get(result.candidate.uri) ?? 0) > 1
        ? result.candidate
        : null;
    const acceptedUri = accepted.get(registrant.bib);
    const reviewed = acceptedUri
      ? (candidates.find((candidate) => candidate.uri === acceptedUri) ?? null)
      : null;
    if (acceptedUri && !reviewed) {
      log(
        `  acceptation ignorée, profil introuvable : ${registrant.bib} ${registrant.name} → ${acceptedUri}`,
      );
    }
    const automatic =
      result.kind === 'match' && !sharedCandidate ? result.candidate : null;
    const candidate = reviewed ?? automatic;
    const sex = candidate?.sex ?? null;
    if (candidate && sex) {
      acceptedCount += reviewed ? 1 : 0;
      if (rowsBySex.get(sex)?.has(candidate.uri)) {
        log(
          `  profil UTMB déjà pris par un autre dossard : ${registrant.bib} ${registrant.name} → ${candidate.uri}`,
        );
      }
      const row = {
        ...splitUtmbFullname(
          restoreApostrophes(candidate.fullname, registrant.name),
        ),
        nationality: toAlpha3(candidate.nationality) ?? toAlpha3(nationality),
        index: candidate.index,
        utmbUrl: utmbProfileUrl(candidate.uri),
      };
      addRow(sex, candidate.uri, row);
      for (const key of firstNameKeys(row.firstName)) {
        sexesByFirstName.set(
          key,
          (sexesByFirstName.get(key) ?? new Set<string>()).add(sex),
        );
      }
    } else {
      const doubt = sharedCandidate
        ? { reason: 'Profil commun à plusieurs dossards', candidates }
        : describeDoubt(result);
      doubts.push({
        registrant,
        nationality,
        ...doubt,
        namesakes: sharedCandidate ? [sharedCandidate] : doubt.candidates,
        suggestion: sharedCandidate
          ? null
          : suggestReviewedCandidate(registrant.name, doubt.candidates),
      });
    }
  }

  const knownFirstNameTokens = new Set(
    [...sexesByFirstName.keys()].flatMap((key) => key.split(' ')),
  );
  const isKnownFirstName = (word: string) =>
    nameTokens(word).every((token) => knownFirstNameTokens.has(token));
  const review: ReviewRow[] = [];
  let leftOutCount = 0;
  for (const doubt of doubts) {
    const { registrant, namesakes } = doubt;
    const [closest] = namesakes;
    const name = splitListName(registrant.name, {
      utmbName: closest ? splitUtmbFullname(closest.fullname) : null,
      isKnownFirstName,
    });
    const sex = name
      ? guessSex(name.firstName, namesakes, sexesByFirstName)
      : null;
    const field = FIELDS.find(({ utmbSex }) => utmbSex === sex);
    if (name && field) {
      addRow(field.utmbSex, `dossard ${registrant.bib}`, {
        ...name,
        nationality: toAlpha3(doubt.nationality),
        index: null,
        utmbUrl: null,
      });
    } else {
      leftOutCount += 1;
    }
    const isWorthReviewing =
      top === 'all' ||
      (doubt.candidates.length > 0 &&
        strongestIndex(doubt.candidates) >= reviewMinIndex);
    if (isWorthReviewing) {
      review.push({
        bib: registrant.bib,
        name: registrant.name,
        country: registrant.country,
        reason: doubt.reason,
        exportedTo: field?.slug ?? (name ? 'Sexe inconnu' : 'Nom incomplet'),
        suggestion: doubt.suggestion
          ? utmbProfileUrl(doubt.suggestion.uri)
          : null,
        candidates: describeCandidates(doubt.candidates),
      });
    }
  }

  const files: OutputFile[] = [];
  const fields: FieldSummary[] = [];
  for (const field of FIELDS) {
    const all = [...(rowsBySex.get(field.utmbSex)?.values() ?? [])].sort(
      byIndexDesc,
    );
    const rows = top === 'all' ? all : all.slice(0, top);
    fields.push({
      label: field.label,
      rows,
      matchedCount: all.filter((row) => row.utmbUrl !== null).length,
    });
    files.push({
      name: `${filePrefix}-${field.slug}.csv`,
      content: toStartListCsv(rows),
    });
  }
  files.push({
    name: `${filePrefix}-a-verifier.csv`,
    content: toReviewCsv(review),
  });
  return {
    files,
    fields,
    scannedCount: scanned.length,
    unmatchedCount: doubts.length,
    reviewCount: review.length,
    acceptedCount,
    leftOutCount,
  };
}
