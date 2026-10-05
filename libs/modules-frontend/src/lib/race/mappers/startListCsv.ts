import { IndexSource } from '@trail/shared/apps/backend/web/data-access-graphql-types';

export type CsvRunner = {
  firstName: string;
  lastName: string;
  nationality: string | null;
  index: number | null;
  indexSource: IndexSource | null;
  utmbUrl: string | null;
  itraUrl: string | null;
};

export type CsvLineState = 'ready' | 'error' | 'duplicate';

export type CsvLine = {
  lineNumber: number;
  fullName: string;
  nationality: string;
  index: string;
  source: string;
  state: CsvLineState;
  message: string;
  runner: CsvRunner | null;
};

export type CsvParseResult = {
  lines: CsvLine[];
  readyRunners: CsvRunner[];
  errorCount: number;
  duplicateCount: number;
};

export const START_LIST_CSV_HEADER =
  'prenom;nom;nationalite;index;source;utmb;itra';

const SOURCES: Record<string, IndexSource> = {
  utmb: IndexSource.Utmb,
  itra: IndexSource.Itra,
  betrail: IndexSource.Betrail,
  manuel: IndexSource.Manual,
  manual: IndexSource.Manual,
};

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
}

export function getRunnerKey(firstName: string, lastName: string): string {
  return `${normalizeName(firstName)} ${normalizeName(lastName)}`;
}

function splitLine(line: string): string[] {
  const separator = line.includes(';') ? ';' : ',';
  return line
    .split(separator)
    .map((cell) => cell.trim().replace(/^"(.*)"$/, '$1'));
}

function parseRunner(cells: string[]): {
  runner: CsvRunner | null;
  error: string | null;
} {
  const [
    firstName = '',
    lastName = '',
    nationality = '',
    index = '',
    source = '',
    utmb = '',
    itra = '',
  ] = cells;
  if (!firstName || !lastName) {
    return { runner: null, error: 'Prénom et nom obligatoires' };
  }
  if (nationality && !/^[A-Za-z]{3}$/.test(nationality)) {
    return { runner: null, error: 'Nationalité : 3 lettres attendues (FRA)' };
  }
  if (index && !/^\d+$/.test(index)) {
    return { runner: null, error: 'Index : nombre attendu' };
  }
  const indexSource = source ? SOURCES[source.toLowerCase()] : undefined;
  if (source && !indexSource) {
    return { runner: null, error: 'Source : utmb, itra, betrail ou manuel' };
  }
  return {
    error: null,
    runner: {
      firstName,
      lastName,
      nationality: nationality ? nationality.toUpperCase() : null,
      index: index ? Number(index) : null,
      indexSource: indexSource ?? (index ? IndexSource.Manual : null),
      utmbUrl: utmb || null,
      itraUrl: itra || null,
    },
  };
}

/** Parses a start list in the browser; known runners and repeated lines are skipped. */
export function parseStartListCsv(
  text: string,
  existingRunners: Array<{ firstName: string; lastName: string }>,
): CsvParseResult {
  const knownKeys = new Set(
    existingRunners.map((runner) =>
      getRunnerKey(runner.firstName, runner.lastName),
    ),
  );
  const lines: CsvLine[] = [];
  text.split(/\r?\n/).forEach((rawLine, position) => {
    if (!rawLine.trim()) {
      return;
    }
    const cells = splitLine(rawLine);
    if (position === 0 && normalizeName(cells[0] ?? '').startsWith('prenom')) {
      return;
    }
    const { runner, error } = parseRunner(cells);
    const base = {
      lineNumber: position + 1,
      fullName: `${cells[0] ?? ''} ${cells[1] ?? ''}`.trim(),
      nationality: cells[2] ?? '',
      index: cells[3] ?? '',
      source: cells[4] ?? '',
    };
    if (!runner) {
      lines.push({
        ...base,
        state: 'error',
        message: error ?? '',
        runner: null,
      });
      return;
    }
    const key = getRunnerKey(runner.firstName, runner.lastName);
    if (knownKeys.has(key)) {
      lines.push({
        ...base,
        state: 'duplicate',
        message: 'Déjà dans la start list, ignoré',
        runner: null,
      });
      return;
    }
    knownKeys.add(key);
    lines.push({ ...base, state: 'ready', message: 'Prêt', runner });
  });
  return {
    lines,
    readyRunners: lines.flatMap((line) => (line.runner ? [line.runner] : [])),
    errorCount: lines.filter((line) => line.state === 'error').length,
    duplicateCount: lines.filter((line) => line.state === 'duplicate').length,
  };
}
