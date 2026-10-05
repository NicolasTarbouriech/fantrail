import { z } from 'zod';

import type { HttpClient } from './http';
import type { UtmbCandidate } from './matching';

export const LIVETRAIL_API_URL = 'https://api.v3.livetrail.net/api';
export const UTMB_API_URL = 'https://api.utmb.world';
export const GRANDRAID_LIST_URL =
  'https://www.grandraid-reunion.com/fr/listes-des-inscrits/';

export type LiveTrailSex = 'MALE' | 'FEMALE';

// Both APIs send 0 for a runner without index: it must stay empty, not rank last.
export function toIndex(value: number | null | undefined): number | null {
  return value && value > 0 ? value : null;
}

const LiveTrailRunner = z.object({
  bib: z.number().nullish(),
  firstName: z.string(),
  lastName: z.string(),
  countryCode: z.string().nullish(),
  sex: z.string().nullish(),
  index: z.number().nullish(),
});

const LiveTrailFavoritesResponse = z.object({
  runners: z.array(LiveTrailRunner),
  totalRunners: z.number(),
});

export type LiveTrailRunner = {
  bib: number | null;
  firstName: string;
  lastName: string;
  countryCode: string | null;
  index: number | null;
};

const FAVORITES_PAGE_SIZE = 50;
const RUNNERS_PAGE_SIZE = 200;

export type LiveTrailQuery = {
  tenant: string;
  raceId: string;
  sex: LiveTrailSex;
};

// Runners who hid their identity come back as "Anonymous" without last name.
function isNamed(runner: z.infer<typeof LiveTrailRunner>): boolean {
  return (
    runner.lastName.trim() !== '' &&
    runner.firstName.trim().toLowerCase() !== 'anonymous'
  );
}

async function fetchLiveTrailPages(
  client: HttpClient,
  path: string,
  { tenant, raceId, sex }: LiveTrailQuery,
  pageSize: number,
  count: number | null,
): Promise<LiveTrailRunner[]> {
  const runners: LiveTrailRunner[] = [];
  for (let page = 0; count === null || runners.length < count; page += 1) {
    const url = new URL(`${LIVETRAIL_API_URL}${path}`);
    url.searchParams.set('raceId', raceId);
    url.searchParams.set('sex', sex);
    url.searchParams.set('limit', String(pageSize));
    url.searchParams.set('page', String(page));
    const response = LiveTrailFavoritesResponse.parse(
      await client.getJson(url.toString(), { 'X-Tenant': tenant }),
    );
    runners.push(
      ...response.runners.filter(isNamed).map((runner) => ({
        bib: runner.bib ?? null,
        firstName: runner.firstName,
        lastName: runner.lastName,
        countryCode: runner.countryCode ?? null,
        index: toIndex(runner.index),
      })),
    );
    if (
      response.runners.length < pageSize ||
      (page + 1) * pageSize >= response.totalRunners
    ) {
      break;
    }
  }
  return count === null ? runners : runners.slice(0, count);
}

/** LiveTrail favorites: runners with an index ≥ 500, strongest first, anonymous ones left out. */
export function fetchLiveTrailFavorites(
  client: HttpClient,
  { count, ...query }: LiveTrailQuery & { count: number },
): Promise<LiveTrailRunner[]> {
  return fetchLiveTrailPages(
    client,
    '/events/runners/favorites',
    query,
    FAVORITES_PAGE_SIZE,
    count,
  );
}

/** Every registered runner of the race, in LiveTrail order. */
export function fetchAllLiveTrailRunners(
  client: HttpClient,
  query: LiveTrailQuery,
): Promise<LiveTrailRunner[]> {
  return fetchLiveTrailPages(
    client,
    '/events/runners',
    query,
    RUNNERS_PAGE_SIZE,
    null,
  );
}

const UtmbSearchResponse = z.object({
  runners: z.array(
    z.object({
      id: z.number(),
      fullname: z.string(),
      uri: z.string(),
      ip: z.number().nullish(),
      nationality: z.string().nullish(),
      sex: z.string().nullish(),
    }),
  ),
});

export async function searchUtmbRunners(
  client: HttpClient,
  text: string,
): Promise<UtmbCandidate[]> {
  const url = new URL(`${UTMB_API_URL}/search/runners`);
  url.searchParams.set('category', 'general');
  url.searchParams.set('search', text);
  url.searchParams.set('limit', '5');
  url.searchParams.set('offset', '0');
  url.searchParams.set('lang', 'fr');
  const response = UtmbSearchResponse.parse(
    await client.getJson(url.toString()),
  );
  return response.runners.map((runner) => ({
    id: runner.id,
    fullname: runner.fullname,
    uri: runner.uri,
    index: toIndex(runner.ip),
    nationality: runner.nationality ?? null,
    sex: runner.sex ?? null,
  }));
}

export function utmbProfileUrl(uri: string): string {
  return `https://utmb.world/runner/${uri}`;
}
