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
  'Keranflec’h Mélanie': [
    {
      id: 7,
      fullname: 'Mélanie KERANFLEC H',
      uri: '7.melanie.keranflec.h',
      ip: 0,
      nationality: 'FR',
      sex: 'F',
    },
  ],
  'Hogan Marianne': [
    {
      id: 8,
      fullname: 'Marianne HOGAN',
      uri: '8.marianne.hogan',
      ip: 810,
      nationality: 'CA',
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

  it('reads every runner with top all and only looks up the strongest', async () => {
    const searches: string[] = [];
    const paths: string[] = [];
    const client = createClient((url) => {
      if (url.hostname === 'api.utmb.world') {
        searches.push(url.searchParams.get('search') ?? '');
        return utmbRoute(url);
      }
      paths.push(`${url.pathname}?page=${url.searchParams.get('page')}`);
      if (url.searchParams.get('sex') === 'FEMALE') {
        return { runners: [], totalRunners: 0 };
      }
      const page = Number(url.searchParams.get('page'));
      const runners =
        page === 0
          ? [
              {
                bib: 7,
                firstName: 'Zoe',
                lastName: 'ZEDIC',
                countryCode: 'FR',
                sex: 'MALE',
                index: 0,
              },
              {
                bib: 3,
                firstName: 'Paul',
                lastName: 'BRUN',
                countryCode: 'FR',
                sex: 'MALE',
                index: 700,
              },
              ...Array.from({ length: 198 }, (_, position) => ({
                bib: 100 + position,
                firstName: 'Runner',
                lastName: `R${String(position).padStart(3, '0')}`,
                countryCode: 'FR',
                sex: 'MALE',
                index: 600,
              })),
            ]
          : [
              {
                bib: 3,
                firstName: 'Paul',
                lastName: 'BRUN',
                countryCode: 'FR',
                sex: 'MALE',
                index: 700,
              },
              {
                bib: 68,
                firstName: 'Francesco',
                lastName: 'PUPPI',
                countryCode: 'IT',
                sex: 'MALE',
                index: 952,
              },
              {
                bib: 8,
                firstName: 'Anne',
                lastName: 'ALPHA',
                countryCode: 'FR',
                sex: 'MALE',
                index: null,
              },
            ];
      return { runners, totalRunners: 203 };
    });
    const result = await buildFromLiveTrail(client, {
      tenant: 'templiers_2026',
      raceId: 'Templi',
      top: 'all',
      filePrefix: 'templiers',
      log: () => undefined,
      enrichCount: 2,
    });
    expect(paths).toEqual([
      '/api/events/runners?page=0',
      '/api/events/runners?page=1',
      '/api/events/runners?page=0',
    ]);
    expect(searches).toEqual(['Francesco PUPPI', 'Paul BRUN']);
    const lines = result.files[0]?.content.trim().split('\n') ?? [];
    expect(lines).toHaveLength(1 + 202);
    expect(lines[1]).toBe(
      'Francesco;Puppi;ITA;952;utmb;https://utmb.world/runner/1.francesco.puppi;',
    );
    expect(lines[2]).toBe('Paul;Brun;FRA;700;utmb;;');
    expect(lines.slice(-2)).toEqual([
      'Anne;Alpha;FRA;;;;',
      'Zoe;Zedic;FRA;;;;',
    ]);
    expect(result).toMatchObject({ scannedCount: 202, unmatchedCount: 1 });
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
    expect(result.files[0]?.content).toContain('Frederic;Abas;FRA;;;;\n');
    expect(result.files[1]?.content).toContain('Marjorie;Amiel;FRA;541');
    expect(result.files[2]?.content).toContain(
      '2;Abas Frederic;France;Homonymes;hommes;;' +
        'Frédéric ABAS (721, FR, H) https://utmb.world/runner/4.frederic.abas | ' +
        'Frederic ABAS (715, FR, H) https://utmb.world/runner/5.frederic.abas\n',
    );
    expect(result).toMatchObject({
      scannedCount: 4,
      unmatchedCount: 2,
      reviewCount: 1,
      acceptedCount: 0,
      leftOutCount: 1,
    });
    expect(result.fields[0]).toMatchObject({ matchedCount: 1 });
    expect(result.fields[0]?.rows).toHaveLength(2);
  });

  it('keeps every runner with top all and takes the reviewed matches', async () => {
    const logs: string[] = [];
    const client = createClient((url) => {
      if (url.hostname === 'api.utmb.world') {
        return utmbRoute(url);
      }
      return (url.searchParams.get('debut_inscrits') ?? '0') === '0'
        ? LIST_PAGE(
            row('1', 'Airiau Gautier') +
              row('2', 'Abas Frederic') +
              row('3', 'Keranflec’h Mélanie'),
          )
        : LIST_PAGE(
            row('4', 'Personne Inconnue') +
              row('5', 'Hogan Marianne') +
              row('6', 'Amiel Marjorie'),
          );
    });
    const result = await buildFromGrandRaid(client, {
      raceType: 'GRR',
      top: 'all',
      filePrefix: 'diagonale',
      log: (message) => logs.push(message),
      baseUrl: 'https://example.org/liste/',
      accepted: new Map([
        ['2', '4.frederic.abas'],
        ['6', '404.marjorie.amiel'],
      ]),
    });
    expect(result.files[0]?.content).toBe(
      'prenom;nom;nationalite;index;source;utmb;itra\n' +
        'Gautier;Airiau;FRA;901;utmb;https://utmb.world/runner/3.gautier.airiau;\n' +
        'Frédéric;Abas;FRA;721;utmb;https://utmb.world/runner/4.frederic.abas;\n',
    );
    expect(result.files[1]?.content).toBe(
      'prenom;nom;nationalite;index;source;utmb;itra\n' +
        'Marjorie;Amiel;FRA;541;utmb;https://utmb.world/runner/6.marjorie.amiel;\n' +
        'Marianne;Hogan;FRA;;;;\n' +
        "Mélanie;Keranflec'h;FRA;;;https://utmb.world/runner/7.melanie.keranflec.h;\n",
    );
    expect(result.files[2]?.content).toBe(
      'dossard;nom_liste;pays_liste;raison;export_sans_index;suggestion;candidats\n' +
        '4;Personne Inconnue;France;Absent d’UTMB;Sexe inconnu;;\n' +
        '5;Hogan Marianne;France;Nationalité différente;femmes;https://utmb.world/runner/8.marianne.hogan;' +
        'Marianne HOGAN (810, CA, F) https://utmb.world/runner/8.marianne.hogan\n',
    );
    expect(logs).toContain(
      '  acceptation ignorée, profil introuvable : 6 Amiel Marjorie → 404.marjorie.amiel',
    );
    expect(result).toMatchObject({
      scannedCount: 6,
      unmatchedCount: 2,
      reviewCount: 2,
      acceptedCount: 1,
    });
  });

  it('sends registrants sharing one profile to review unless accepted', async () => {
    const client = createClient((url) =>
      url.hostname === 'api.utmb.world'
        ? utmbRoute(url)
        : LIST_PAGE(row('1', 'Airiau Gautier') + row('9', 'Airiau Gautier')),
    );
    const build = (accepted: Map<string, string>, log: (m: string) => void) =>
      buildFromGrandRaid(client, {
        raceType: 'GRR',
        top: 'all',
        filePrefix: 'grr',
        log,
        baseUrl: 'https://example.org/liste/',
        accepted,
      });

    const result = await build(
      new Map([['9', '3.gautier.airiau']]),
      () => undefined,
    );
    expect(result.fields[0]?.rows).toEqual([
      expect.objectContaining({ index: 901 }),
      expect.objectContaining({
        firstName: 'Gautier',
        lastName: 'Airiau',
        index: null,
        utmbUrl: null,
      }),
    ]);
    expect(result.files[2]?.content).toBe(
      'dossard;nom_liste;pays_liste;raison;export_sans_index;suggestion;candidats\n' +
        '1;Airiau Gautier;France;Profil commun à plusieurs dossards;hommes;;' +
        'Gautier AIRIAU (901, FR, H) https://utmb.world/runner/3.gautier.airiau\n',
    );

    const logs: string[] = [];
    await build(
      new Map([
        ['1', '3.gautier.airiau'],
        ['9', '3.gautier.airiau'],
      ]),
      (message) => logs.push(message),
    );
    expect(logs).toContain(
      '  profil UTMB déjà pris par un autre dossard : 9 Airiau Gautier → 3.gautier.airiau',
    );
  });

  it('exports both namesakes without index when neither is reviewed', async () => {
    const client = createClient((url) =>
      url.hostname === 'api.utmb.world'
        ? utmbRoute(url)
        : LIST_PAGE(row('1', 'Airiau Gautier') + row('9', 'Airiau Gautier')),
    );
    const result = await buildFromGrandRaid(client, {
      raceType: 'GRR',
      top: 'all',
      filePrefix: 'grr',
      log: () => undefined,
      baseUrl: 'https://example.org/liste/',
    });
    expect(result.files[0]?.content).toBe(
      'prenom;nom;nationalite;index;source;utmb;itra\n' +
        'Gautier;Airiau;FRA;;;;\n' +
        'Gautier;Airiau;FRA;;;;\n',
    );
    expect(result).toMatchObject({ unmatchedCount: 2, leftOutCount: 0 });
  });

  it('tells the sex of an unknown runner by the first names already matched', async () => {
    const client = createClient((url) =>
      url.hostname === 'api.utmb.world'
        ? utmbRoute(url)
        : LIST_PAGE(
            row('1', 'Airiau Gautier') +
              row('2', 'Amiel Marjorie') +
              row('3', 'DURAND DUPONT Gautier') +
              row('4', 'Petit Marjorie Gautier') +
              row('5', 'grand gautier') +
              row('6', 'Solo') +
              row('7', 'Martin Camille'),
          ),
    );
    const result = await buildFromGrandRaid(client, {
      raceType: 'GRR',
      top: 'all',
      filePrefix: 'grr',
      log: () => undefined,
      baseUrl: 'https://example.org/liste/',
    });
    expect(result.fields[0]?.rows.slice(1)).toEqual([
      expect.objectContaining({
        firstName: 'Gautier',
        lastName: 'Durand Dupont',
      }),
      expect.objectContaining({ firstName: 'Gautier', lastName: 'Grand' }),
    ]);
    expect(result.fields[1]?.rows[1]).toMatchObject({
      firstName: 'Marjorie Gautier',
      lastName: 'Petit',
    });
    expect(result.files[2]?.content).toContain(
      '4;Petit Marjorie Gautier;France;Absent d’UTMB;femmes;;\n',
    );
    expect(result.files[2]?.content).toContain(
      '6;Solo;France;Absent d’UTMB;Nom incomplet;;\n',
    );
    expect(result.files[2]?.content).toContain(
      '7;Martin Camille;France;Absent d’UTMB;Sexe inconnu;;\n',
    );
    expect(result).toMatchObject({ unmatchedCount: 5, leftOutCount: 2 });
  });

  it('leaves out a runner whose namesakes contradict the first name', async () => {
    const client = createClient((url) => {
      if (url.hostname !== 'api.utmb.world') {
        return LIST_PAGE(
          row('1', 'Amiel Marjorie') + row('2', 'Gonzalez Marjorie'),
        );
      }
      return url.searchParams.get('search') === 'Gonzalez Marjorie'
        ? {
            runners: [
              {
                id: 9,
                fullname: 'Marjorie GONZALEZ',
                uri: '9.marjorie.gonzalez',
                ip: 640,
                nationality: 'ES',
                sex: 'H',
              },
            ],
          }
        : utmbRoute(url);
    });
    const result = await buildFromGrandRaid(client, {
      raceType: 'GRR',
      top: 'all',
      filePrefix: 'grr',
      log: () => undefined,
      baseUrl: 'https://example.org/liste/',
    });
    expect(result.fields[0]?.rows).toEqual([]);
    expect(result.files[2]?.content).toContain(
      '2;Gonzalez Marjorie;France;Nationalité différente;Sexe inconnu;',
    );
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
