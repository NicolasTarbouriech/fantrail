import { Gender } from '@trail/shared/apps/backend/web/data-access-graphql-types';

const FIELD_LABELS: Record<
  Gender,
  { long: string; short: string; slug: string }
> = {
  [Gender.Men]: { long: 'Élites hommes', short: 'Hommes', slug: 'hommes' },
  [Gender.Women]: { long: 'Élites femmes', short: 'Femmes', slug: 'femmes' },
};

export const FIELD_GENDER_ORDER = [Gender.Men, Gender.Women];

export function getFieldLabel(gender: Gender): string {
  return FIELD_LABELS[gender].long;
}

export function getFieldShortLabel(gender: Gender): string {
  return FIELD_LABELS[gender].short;
}

export function getFieldSlug(gender: Gender): string {
  return FIELD_LABELS[gender].slug;
}

export function findGenderBySlug(slug: string | undefined): Gender | null {
  return (
    FIELD_GENDER_ORDER.find((gender) => getFieldSlug(gender) === slug) ?? null
  );
}

export function sortByGender<T extends { gender: Gender }>(fields: T[]): T[] {
  return [...fields].sort(
    (a, b) =>
      FIELD_GENDER_ORDER.indexOf(a.gender) -
      FIELD_GENDER_ORDER.indexOf(b.gender),
  );
}

const SHORT_NAME_SKIPPED_WORDS = new Set([
  'grand',
  'trail',
  'ultra',
  'raid',
  'le',
  'la',
  'les',
  'du',
  'de',
  'des',
  'd',
  'l',
]);

/** "Grand Trail des Templiers 2026" → "Templiers", for tabs. */
export function getRaceShortName(name: string): string {
  const words = name
    .split(/[\s'’-]+/)
    .filter((word) => word && !/^\d{4}$/.test(word));
  return (
    words.find((word) => !SHORT_NAME_SKIPPED_WORDS.has(word.toLowerCase())) ??
    words[0] ??
    name
  );
}
