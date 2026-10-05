import { buildFromGrandRaid, buildFromLiveTrail } from './commands';
import { type FetchLike, HttpClient } from './http';

type Route = (url: URL, headers: Record<string, string>) => unknown;

function createClient(route: Route): HttpClient {
  const fetchImpl: FetchLike = async (url, init) => {
    const body = route(new URL(url), init.headers);
    return {
      ok: true,
      status: 200,
      text: async () =>
        typeof body === 'string' ? body : JSON.stringify(body),
    };
  };
  return new HttpClient({
    fetchImpl,
    cacheDir: null,
    delayInMs: 0,
    retries: 0,
    sleep: async () => undefined,
    now: () => 0,
    log: () => undefined,
  });
}

const UTMB = {
  'Francesco PUPPI': [
    {
      id: 1,
      fullname: 'Francesco PUPPI',
      uri: '1.francesco.puppi',
      ip: 952,
      nationality: 'IT',
      sex: 'H',
    },
  ],
  'Judith WYDER': [
    {
      id: 2,
      fullname: 'Judith WYDER',
      uri: '2.judith.wyder',
      ip: 819,
      nationality: 'CH',
      sex: 'F',
    },
  ],
  'Airiau Gautier': [
    {
      id: 3,
      fullname: 'Gautier AIRIAU',
      uri: '3.gautier.airiau',
      ip: 901,
      nationality: 'FR',
      sex: 'H',
    },
  ],
  'Abas Frederic': [
    {
      id: 4,
      fullname: 'Frédéric ABAS',
      uri: '4.frederic.abas',
      ip: 721,
      nationality: 'FR',
      sex: 'H',
    },
    {
      id: 5,
      fullname: 'Frederic ABAS',
      uri: '5.frederic.abas',
      ip: 715,
      nationality: 'FR',
      sex: 'H',
    },
  ],
  'Amiel Marjorie': [
    {
      id: 6,
      fullname: 'Marjorie AMIEL',
      uri: '6.marjorie.amiel',
      ip: 541,
      nationality: 'FR',
      sex: 'F',
    },
  ],
};

function utmbRoute(url: URL): unknown {
  const search = url.searchParams.get('search') ?? '';
  return { runners: UTMB[search as keyof typeof UTMB] ?? [] };
}

describe('buildFromLiveTrail', () => {
  it('writes one file per field, linked to UTMB', async () => {
    const tenants: string[] = [];
    const client = createClient((url, headers) => {
      if (url.hostname === 'api.utmb.world') {
        return utmbRoute(url);
      }
      tenants.push(headers['X-Tenant'] ?? '');
      const sex = url.searchParams.get('sex');
      return sex === 'MALE'
        ? {
            runners: [
              {
                bib: 68,
                firstName: 'Francesco',
                lastName: 'PUPPI',
                countryCode: 'IT',
                sex: 'MALE',
                index: 952,
              },
              {
                bib: 9,
                firstName: 'Anonymous',
                lastName: '',
                countryCode: null,
                sex: 'MALE',
                index: null,
              },
              {
                bib: 18,
                firstName: 'Paul',
                lastName: 'INCONNU',
                countryCode: 'FR',
                sex: 'MALE',
                index: 930,
              },
            ],
            totalRunners: 3,
          }
        : {
            runners: [
              {
                bib: 1,
                firstName: 'Judith',
                lastName: 'WYDER',
                countryCode: 'CH',
                sex: 'FEMALE',
                index: 819,
              },
            ],
            totalRunners: 1,
          };
    });
    const result = await buildFromLiveTrail(client, {
      tenant: 'templiers_2026',
      raceId: 'Templi',
      top: 30,
      filePrefix: 'templi',
      log: () => undefined,
    });
    expect(tenants).toEqual(['templiers_2026', 'templiers_2026']);
    expect(result.files.map((file) => file.name)).toEqual([
      'templi-hommes.csv',
      'templi-femmes.csv',
    ]);
    expect(result.files[0]?.content).toBe(
      'prenom;nom;nationalite;index;source;utmb;itra\n' +
        'Francesco;Puppi;ITA;952;utmb;https://utmb.world/runner/1.francesco.puppi;\n' +
        'Paul;Inconnu;FRA;930;utmb;;\n',
    );
    expect(result.fields.map((field) => field.matchedCount)).toEqual([1, 1]);
    expect(result).toMatchObject({
      scannedCount: 3,
      unmatchedCount: 1,
      reviewCount: 0,
    });
  });
});

const LIST_PAGE = (rows: string) => `
<select name="pays"><option value='FR'>France</option></select>
<p><strong>60 coureurs</strong></p>
<ol>${rows}</ol>`;

function row(bib: string, name: string): string {
  return `<li><div><span class="number"> ${bib} </span><span class="title"> ${name} </span><span class="country"> France </span><span class="country"> Résident </span></div></li>`;
}

describe('buildFromGrandRaid', () => {
  it('keeps certain matches by sex and lists the doubtful ones', async () => {
    const pages: string[] = [];
    const client = createClient((url) => {
      if (url.hostname === 'api.utmb.world') {
        return utmbRoute(url);
      }
      const offset = url.searchParams.get('debut_inscrits') ?? '0';
      pages.push(offset);
      return offset === '0'
        ? LIST_PAGE(row('1', 'Airiau Gautier') + row('2', 'Abas Frederic'))
        : LIST_PAGE(row('3', 'Amiel Marjorie') + row('4', 'Personne Inconnue'));
    });
    const result = await buildFromGrandRaid(client, {
      raceType: 'GRR',
      top: 30,
      filePrefix: 'grr',
      log: () => undefined,
      baseUrl: 'https://example.org/liste/',
    });
    expect(pages).toEqual(['0', '50']);
    expect(result.files.map((file) => file.name)).toEqual([
      'grr-hommes.csv',
      'grr-femmes.csv',
      'grr-a-verifier.csv',
    ]);
    expect(result.files[0]?.content).toContain(
      'Gautier;Airiau;FRA;901;utmb;https://utmb.world/runner/3.gautier.airiau;',
    );
    expect(result.files[1]?.content).toContain('Marjorie;Amiel;FRA;541');
    expect(result.files[2]?.content).toContain(
      '2;Abas Frederic;France;Homonymes;Frédéric ABAS (721, FR)',
    );
    expect(result).toMatchObject({
      scannedCount: 4,
      unmatchedCount: 2,
      reviewCount: 1,
    });
  });

  it('stops after the requested number of registrants', async () => {
    const client = createClient((url) =>
      url.hostname === 'api.utmb.world'
        ? utmbRoute(url)
        : LIST_PAGE(row('1', 'Airiau Gautier')),
    );
    const result = await buildFromGrandRaid(client, {
      raceType: 'GRR',
      top: 1,
      filePrefix: 'grr',
      log: () => undefined,
      baseUrl: 'https://example.org/liste/',
      maxRegistrants: 1,
    });
    expect(result.scannedCount).toBe(1);
    expect(result.fields[0]?.rows).toHaveLength(1);
  });
});
