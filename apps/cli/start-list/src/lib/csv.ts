export const START_LIST_CSV_HEADER =
  'prenom;nom;nationalite;index;source;utmb;itra';
export const REVIEW_CSV_HEADER =
  'dossard;nom_liste;pays_liste;raison;candidats';

export type StartListRow = {
  firstName: string;
  lastName: string;
  nationality: string | null;
  index: number | null;
  utmbUrl: string | null;
};

export type ReviewRow = {
  bib: string;
  name: string;
  country: string;
  reason: string;
  candidates: string;
};

// The admin import splits lines on ";" without quotes: separators never reach a cell.
function cell(value: string | number | null): string {
  if (value === null) {
    return '';
  }
  return String(value)
    .replace(/[;\r\n]+/g, ' ')
    .trim();
}

function toLines(
  header: string,
  rows: Array<Array<string | number | null>>,
): string {
  return (
    [header, ...rows.map((row) => row.map(cell).join(';'))].join('\n') + '\n'
  );
}

export function toStartListCsv(rows: StartListRow[]): string {
  return toLines(
    START_LIST_CSV_HEADER,
    rows.map((row) => [
      row.firstName,
      row.lastName,
      row.nationality,
      row.index,
      row.index === null ? null : 'utmb',
      row.utmbUrl,
      null,
    ]),
  );
}

export function toReviewCsv(rows: ReviewRow[]): string {
  return toLines(
    REVIEW_CSV_HEADER,
    rows.map((row) => [
      row.bib,
      row.name,
      row.country,
      row.reason,
      row.candidates,
    ]),
  );
}
