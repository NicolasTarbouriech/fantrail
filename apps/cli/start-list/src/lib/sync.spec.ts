import type { FantrailApi } from './fantrailApi';
import type { HttpClient } from './http';
import type { LiveTrailRunner } from './sources';
import {
  type StartListRunner,
  formatSyncReport,
  isSuspicious,
  parseLiveTrailRaceUrl,
  planFieldSync,
  syncStartLists,
} from './sync';

function ours(
  id: string,
  firstName: string,
  lastName: string,
  overrides: Partial<StartListRunner> = {},
): StartListRunner {
  return {
    id,
    firstName,
    lastName,
    nationality: 'FRA',
    index: 800,
    indexSource: 'Utmb',
    utmbUrl: null,
    itraUrl: null,
    isWithdrawn: false,
    ...overrides,
  };
}

function theirs(
  bib: number,
  firstName: string,
  lastName: string,
  index: number | null = 800,
  countryCode = 'FR',
): LiveTrailRunner {
  return { bib, firstName, lastName, countryCode, index };
}

describe('parseLiveTrailRaceUrl', () => {
  it('reads the tenant and the race of a LiveTrail race page', () => {
    expect(
      parseLiveTrailRaceUrl(
        'https://templiers.v3.livetrail.net/fr/2026/races/Templi',
      ),
    ).toEqual({ tenant: 'templiers_2026', raceId: 'Templi' });
    expect(
      parseLiveTrailRaceUrl(
        'https://grandraid-reunion.v3.livetrail.net/fr/2026/races/GRR?tab=1',
      ),
    ).toEqual({ tenant: 'grandraid-reunion_2026', raceId: 'GRR' });
  });

  it('ignores an event page or no url', () => {
    expect(
      parseLiveTrailRaceUrl('https://templiers.v3.livetrail.net/fr/2026'),
    ).toBeNull();
    expect(parseLiveTrailRaceUrl(null)).toBeNull();
  });
});

describe('planFieldSync', () => {
  it('updates changed indexes, adds new registrants and lists the absent', () => {
    const plan = planFieldSync(
      [
        ours('a', 'Thomas', 'Cardin', { index: 930 }),
        ours('b', 'Benjamin', 'Roubiol', { index: 939 }),
        ours('c', 'Léo', 'Absent'),
      ],
      [
        theirs(2, 'Thomas', 'CARDIN', 934),
        theirs(18, 'Benjamin', 'ROUBIOL', 939),
        theirs(18, 'Benjamin', 'ROUBIOL', 939),
        theirs(40, 'Hugo', 'NOUVEAU', null, 'ES'),
      ],
    );
    expect(plan.liveTrailCount).toBe(3);
    expect(plan.updates).toEqual([
      { runner: expect.objectContaining({ id: 'a' }), index: 934 },
    ]);
    expect(plan.additions).toEqual([
      {
        firstName: 'Hugo',
        lastName: 'Nouveau',
        nationality: 'ESP',
        index: null,
        indexSource: null,
        utmbUrl: null,
        itraUrl: null,
      },
    ]);
    expect(plan.missing.map(({ id }) => id)).toEqual(['c']);
  });

  it('keeps an index LiveTrail does not know', () => {
    const plan = planFieldSync(
      [ours('a', 'Thomas', 'Cardin', { index: 930 })],
      [theirs(2, 'Thomas', 'Cardin', null)],
    );
    expect(plan.updates).toEqual([]);
  });

  it('pairs namesakes by nationality', () => {
    const plan = planFieldSync(
      [
        ours('fr', 'Nicolas', 'Martin', { index: 600 }),
        ours('be', 'Nicolas', 'Martin', { nationality: 'BEL', index: 700 }),
      ],
      [
        theirs(1, 'Nicolas', 'MARTIN', 710, 'BE'),
        theirs(2, 'Nicolas', 'MARTIN', 600, 'FR'),
      ],
    );
    expect(plan.updates).toEqual([
      { runner: expect.objectContaining({ id: 'be' }), index: 710 },
    ]);
    expect(plan.missing).toEqual([]);
  });

  it('leaves close names and returning withdrawn runners to a human', () => {
    const plan = planFieldSync(
      [
        ours('a', 'Jean', 'Dupont'),
        ours('w', 'Marc', 'Retire', { isWithdrawn: true }),
      ],
      [theirs(1, 'Jean-Pierre', 'DUPONT'), theirs(2, 'Marc', 'RETIRE')],
    );
    expect(plan.ambiguous.map(({ firstName }) => firstName)).toEqual([
      'Jean-Pierre',
    ]);
    expect(plan.reappeared.map(({ id }) => id)).toEqual(['w']);
    expect(plan.additions).toEqual([]);
    expect(plan.missing.map(({ id }) => id)).toEqual(['a']);
  });
});

describe('isSuspicious', () => {
  const plan = planFieldSync([], []);

  it('accepts small moves and flags big ones', () => {
    expect(isSuspicious(plan, 1000)).toBe(false);
    expect(
      isSuspicious(
        {
          ...plan,
          additions: Array.from({ length: 101 }, () => ({
            firstName: 'A',
            lastName: 'B',
            nationality: null,
            index: null,
            indexSource: null,
            utmbUrl: null,
            itraUrl: null,
          })),
        },
        1000,
      ),
    ).toBe(true);
    expect(
      isSuspicious(
        {
          ...plan,
          missing: Array.from({ length: 21 }, () => ours('x', 'A', 'B')),
        },
        50,
      ),
    ).toBe(true);
  });
});

describe('syncStartLists', () => {
  const RACES = {
    adminRaces: [
      {
        id: 'gtt',
        name: 'Grand Trail des Templiers',
        status: 'Open',
        liveTrailUrl: 'https://templiers.v3.livetrail.net/fr/2026/races/Templi',
        fields: [
          {
            id: 'men',
            gender: 'Men',
            isLocked: false,
            startList: {
              runners: [ours('a', 'Thomas', 'Cardin', { index: 930 })],
            },
          },
          {
            id: 'women',
            gender: 'Women',
            isLocked: true,
            startList: { runners: [] },
          },
        ],
      },
      {
        id: 'diag',
        name: 'Diagonale des Fous',
        status: 'Open',
        liveTrailUrl: 'https://grandraid-reunion.v3.livetrail.net/fr/2026',
        fields: [],
      },
      {
        id: 'old',
        name: 'Ancienne course',
        status: 'Scored',
        liveTrailUrl: null,
        fields: [],
      },
    ],
  };

  function setUp(liveTrailRunners: LiveTrailRunner[]) {
    const api = {
      waitUntilAwake: jest.fn().mockResolvedValue(undefined),
      request: jest.fn((query: string) =>
        Promise.resolve(query.includes('SyncStartLists') ? RACES : {}),
      ),
    } as unknown as FantrailApi;
    const client = {
      getJson: jest.fn().mockResolvedValue({
        runners: liveTrailRunners,
        totalRunners: liveTrailRunners.length,
      }),
    } as unknown as HttpClient;
    return { api, client };
  }

  it('writes the plan of every open, unlocked field', async () => {
    const { api, client } = setUp([
      theirs(2, 'Thomas', 'CARDIN', 934),
      theirs(40, 'Hugo', 'NOUVEAU'),
    ]);
    const report = await syncStartLists(api, client, {
      dryRun: false,
      log: jest.fn(),
    });
    expect(report.fields).toHaveLength(1);
    expect(report.fields[0]?.status).toBe('applied');
    expect(api.request).toHaveBeenCalledWith(
      expect.stringContaining('updateRunner'),
      expect.objectContaining({
        fieldId: 'men',
        runnerId: 'a',
        data: expect.objectContaining({ index: 934, firstName: 'Thomas' }),
      }),
      expect.anything(),
    );
    expect(api.request).toHaveBeenCalledWith(
      expect.stringContaining('addRunners'),
      expect.objectContaining({
        fieldId: 'men',
        dataList: [expect.objectContaining({ lastName: 'Nouveau' })],
      }),
      expect.anything(),
    );
    expect(report.skipped).toEqual([
      'Grand Trail des Templiers · femmes : verrouillé',
      'Diagonale des Fous : pas de page de course LiveTrail',
    ]);
  });

  it('writes nothing in a dry run', async () => {
    const { api, client } = setUp([theirs(2, 'Thomas', 'CARDIN', 934)]);
    const report = await syncStartLists(api, client, {
      dryRun: true,
      log: jest.fn(),
    });
    expect(report.fields[0]?.status).toBe('dry-run');
    expect(api.request).toHaveBeenCalledTimes(1);
  });

  it('skips an empty LiveTrail list and keeps going after an error', async () => {
    const empty = setUp([]);
    const emptyReport = await syncStartLists(empty.api, empty.client, {
      dryRun: false,
      log: jest.fn(),
    });
    expect(emptyReport.skipped[0]).toBe(
      'Grand Trail des Templiers · hommes : liste LiveTrail vide',
    );

    const { api, client } = setUp([
      theirs(2, 'Thomas', 'CARDIN', 934),
      theirs(40, 'Hugo', 'NOUVEAU'),
    ]);
    jest
      .mocked(api.request)
      .mockImplementation((query: string) =>
        query.includes('SyncStartLists')
          ? Promise.resolve(RACES)
          : Promise.reject(new Error('Field locked')),
      );
    const report = await syncStartLists(api, client, {
      dryRun: false,
      log: jest.fn(),
    });
    expect(report.fields[0]?.errors).toEqual([
      'Thomas Cardin : Field locked',
      'ajout de coureurs : Field locked',
    ]);
  });

  it('writes nothing when the moves look like a LiveTrail glitch', async () => {
    const { api, client } = setUp(
      Array.from({ length: 30 }, (_, index) =>
        theirs(100 + index, `Prenom${index}`, `NOM${index}`),
      ),
    );
    const report = await syncStartLists(api, client, {
      dryRun: false,
      log: jest.fn(),
    });
    expect(report.fields[0]?.status).toBe('suspicious');
    expect(api.request).toHaveBeenCalledTimes(1);
  });
});

describe('formatSyncReport', () => {
  it('sums up each field and lists what needs a human', () => {
    const plan = planFieldSync(
      [
        ours('c', 'Léo', 'Absent'),
        ours('d', 'Jean', 'Dupont'),
        ours('w', 'Marc', 'Retire', { isWithdrawn: true }),
      ],
      [theirs(1, 'Jean-Pierre', 'DUPONT'), theirs(2, 'Marc', 'RETIRE')],
    );
    const markdown = formatSyncReport({
      fields: [
        {
          raceName: 'Grand Trail des Templiers',
          gender: 'Women',
          plan,
          status: 'applied',
          errors: ['Léo Absent : boom'],
        },
      ],
      skipped: ['Diagonale des Fous · hommes : liste LiveTrail vide'],
    });
    expect(markdown).toContain(
      '| Grand Trail des Templiers · femmes | 2 | 0 | 0 | 2 | 2 | appliqué, 1 erreurs |',
    );
    expect(markdown).toContain('- Léo Absent');
    expect(markdown).toContain('- Jean-Pierre DUPONT');
    expect(markdown).toContain('- Marc Retire');
    expect(markdown).toContain('- Léo Absent : boom');
    expect(markdown).toContain(
      '- Diagonale des Fous · hommes : liste LiveTrail vide',
    );
  });
});
