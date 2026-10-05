import { intFlag, parseArgs, requireFlag } from './args';
import { toReviewCsv, toStartListCsv } from './csv';
import {
  decodeEntities,
  parseRegistrantsPage,
  registrantsPageUrl,
} from './grandraidList';

const PAGE = `
<form><select name="pays" id="pays">
  <option class="hide-me" value="">Pays (ou DOM-TOM)</option>
  <option value="">Tous</option>
  <option  value='BE'>Belgique</option>
  <option  value='RE'>R&#233;union</option>
</select></form>
<p><strong>2842 coureurs</strong></p>
<ol class="result-list">
  <li class="bold"><div><span class="number"> Dossard </span><span class="title"> Nom et prénom </span><span class="country"> Pays </span><span class="country"> Quota </span></div></li>
  <li><div><span class="number"> 47 </span><span class="title"> Ammendola Antonio </span><span class="country"> Belgique </span><span class="country"> Extérieur </span></div></li>
  <li><div><span class="number"> 2634 </span><span class="title"> MELOBOSIS  Gilbert </span><span class="country"> R&eacute;union </span><span class="country"> Résident </span></div></li>
</ol>`;

describe('parseRegistrantsPage', () => {
  it('reads the rows, the total and the country codes', () => {
    const page = parseRegistrantsPage(PAGE);
    expect(page.total).toBe(2842);
    expect(page.registrants).toEqual([
      {
        bib: '47',
        name: 'Ammendola Antonio',
        country: 'Belgique',
        quota: 'Extérieur',
      },
      {
        bib: '2634',
        name: 'MELOBOSIS Gilbert',
        country: 'Réunion',
        quota: 'Résident',
      },
    ]);
    expect(page.countryCodes.get('Réunion')).toBe('RE');
    expect(parseRegistrantsPage('<p>rien</p>')).toMatchObject({
      total: null,
      registrants: [],
    });
  });

  it('decodes entities and builds page urls', () => {
    expect(
      decodeEntities('R&#233;union &amp; &#x41; &eacute; &Eacute; &hellip;'),
    ).toBe('Réunion & A é É &hellip;');
    expect(registrantsPageUrl('https://example.org/liste/', 'GRR', 0)).toBe(
      'https://example.org/liste/?type_course=GRR',
    );
    expect(registrantsPageUrl('https://example.org/liste/', 'GRR', 50)).toBe(
      'https://example.org/liste/?type_course=GRR&debut_inscrits=50',
    );
  });
});

describe('csv', () => {
  it('writes the admin import format without separators inside cells', () => {
    expect(
      toStartListCsv([
        {
          firstName: 'Francesco',
          lastName: 'Puppi',
          nationality: 'ITA',
          index: 952,
          utmbUrl: 'https://utmb.world/runner/1',
        },
        {
          firstName: 'Ana;Maria',
          lastName: 'Sola\nX',
          nationality: null,
          index: null,
          utmbUrl: null,
        },
      ]),
    ).toBe(
      'prenom;nom;nationalite;index;source;utmb;itra\nFrancesco;Puppi;ITA;952;utmb;https://utmb.world/runner/1;\nAna Maria;Sola X;;;;;\n',
    );
    expect(
      toReviewCsv([
        {
          bib: '47',
          name: 'Ammendola Antonio',
          country: 'Belgique',
          reason: 'Homonymes',
          candidates: 'a | b',
        },
      ]),
    ).toBe(
      'dossard;nom_liste;pays_liste;raison;candidats\n47;Ammendola Antonio;Belgique;Homonymes;a | b\n',
    );
  });
});

describe('args', () => {
  it('parses the command and its flags', () => {
    const { command, flags } = parseArgs([
      'livetrail',
      '--tenant',
      'templiers_2026',
      '--top=10',
      '--verbose',
      '--race',
      'Templi',
    ]);
    expect(command).toBe('livetrail');
    expect(requireFlag(flags, 'tenant')).toBe('templiers_2026');
    expect(intFlag(flags, 'top', 30)).toBe(10);
    expect(intFlag(flags, 'max', 30)).toBe(30);
    expect(flags.get('verbose')).toBe('true');
    expect(() => requireFlag(flags, 'out')).toThrow('--out est obligatoire');
    expect(() => requireFlag(flags, 'verbose')).toThrow(
      '--verbose est obligatoire',
    );
    expect(() => intFlag(flags, 'race', 1)).toThrow(
      '--race attend un entier positif',
    );
    expect(parseArgs([]).command).toBeNull();
  });
});
