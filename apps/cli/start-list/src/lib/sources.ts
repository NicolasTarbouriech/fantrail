import { z } from 'zod';

import type { HttpClient } from './http';
import type { UtmbCandidate } from './matching';

export const LIVETRAIL_API_URL = 'https://api.v3.livetrail.net/api';
export const UTMB_API_URL = 'https://api.utmb.world';
export const GRANDRAID_LIST_URL =
  'https://www.grandraid-reunion.com/fr/listes-des-inscrits/';

export type LiveTrailSex = 'MALE' | 'FEMALE';

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

const PAGE_SIZE = 50;

// Runners who hid their identity come back as "Anonymous" without last name.
function isNamed(runner: z.infer<typeof LiveTrailRunner>): boolean {
  return (
    runner.lastName.trim() !== '' &&
    runner.firstName.trim().toLowerCase() !== 'anonymous'
  );
}

/** LiveTrail favorites: runners with an index, strongest first, anonymous ones left out. */
export async function fetchLiveTrailFavorites(
  client: HttpClient,
  {
    tenant,
    raceId,
    sex,
    count,
  }: { tenant: string; raceId: string; sex: LiveTrailSex; count: number },
): Promise<LiveTrailRunner[]> {
  const runners: LiveTrailRunner[] = [];
  for (let page = 0; runners.length < count; page += 1) {
    const url = new URL(`${LIVETRAIL_API_URL}/events/runners/favorites`);
    url.searchParams.set('raceId', raceId);
    url.searchParams.set('sex', sex);
    url.searchParams.set('limit', String(PAGE_SIZE));
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
        index: runner.index ?? null,
      })),
    );
    if (
      response.runners.length < PAGE_SIZE ||
      (page + 1) * PAGE_SIZE >= response.totalRunners
    ) {
      break;
    }
  }
  return runners.slice(0, count);
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
    index: runner.ip ?? null,
    nationality: runner.nationality ?? null,
    sex: runner.sex ?? null,
  }));
}

export function utmbProfileUrl(uri: string): string {
  return `https://utmb.world/runner/${uri}`;
}
