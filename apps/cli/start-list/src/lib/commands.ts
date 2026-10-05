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
import { formatNamePart, splitUtmbFullname } from './text';

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
        `${candidate.fullname} (${candidate.index ?? '—'}, ${candidate.nationality ?? '?'}) ${utmbProfileUrl(candidate.uri)}`,
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
        reason: 'Nationalité différente',
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
  return { files, fields, scannedCount, unmatchedCount, reviewCount: 0 };
}

export type GrandRaidOptions = {
  raceType: string;
  top: number;
  filePrefix: string;
  log: Log;
  baseUrl?: string;
  reviewMinIndex?: number;
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

/** Official registrants, each looked up on UTMB: certain matches only, strongest index first. */
export async function buildFromGrandRaid(
  client: HttpClient,
  {
    raceType,
    top,
    filePrefix,
    log,
    baseUrl = GRANDRAID_LIST_URL,
    reviewMinIndex = 700,
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
  const rowsBySex = new Map<string, Map<string, StartListRow>>();
  const review: ReviewRow[] = [];
  let unmatchedCount = 0;

  for (const [position, registrant] of scanned.entries()) {
    const nationality = countryCodes.get(registrant.country) ?? null;
    const candidates = await searchUtmbRunners(client, registrant.name);
    const result = matchRunner(
      { name: registrant.name, nationality },
      candidates,
    );
    const candidate = result.kind === 'match' ? result.candidate : null;
    const sex = candidate?.sex ?? null;
    if (candidate && sex) {
      const rows = rowsBySex.get(sex) ?? new Map<string, StartListRow>();
      rows.set(candidate.uri, {
        ...splitUtmbFullname(candidate.fullname),
        nationality: toAlpha3(candidate.nationality) ?? toAlpha3(nationality),
        index: candidate.index,
        utmbUrl: utmbProfileUrl(candidate.uri),
      });
      rowsBySex.set(sex, rows);
    } else {
      unmatchedCount += 1;
      const doubtful = describeDoubt(result);
      if (
        doubtful.candidates.length > 0 &&
        strongestIndex(doubtful.candidates) >= reviewMinIndex
      ) {
        review.push({
          bib: registrant.bib,
          name: registrant.name,
          country: registrant.country,
          reason: doubtful.reason,
          candidates: describeCandidates(doubtful.candidates),
        });
      }
    }
    if ((position + 1) % 100 === 0) {
      log(`${position + 1}/${scanned.length} inscrits cherchés sur UTMB`);
    }
  }

  const files: OutputFile[] = [];
  const fields: FieldSummary[] = [];
  for (const field of FIELDS) {
    const all = [...(rowsBySex.get(field.utmbSex)?.values() ?? [])].sort(
      byIndexDesc,
    );
    const rows = all.slice(0, top);
    fields.push({ label: field.label, rows, matchedCount: all.length });
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
    unmatchedCount,
    reviewCount: review.length,
  };
}
