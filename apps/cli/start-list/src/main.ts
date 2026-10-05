import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { intFlag, parseArgs, requireFlag } from './lib/args';
import {
  type CommandResult,
  buildFromGrandRaid,
  buildFromLiveTrail,
} from './lib/commands';
import { parseAcceptedMatches } from './lib/csv';
import { FantrailApi } from './lib/fantrailApi';
import { HttpClient } from './lib/http';
import { formatSyncReport, syncStartLists } from './lib/sync';

const USAGE = `Construit les start lists à importer dans l'admin (CSV prenom;nom;nationalite;index;source;utmb;itra).

  livetrail --tenant <tenant> --race <raceId> [--top 30|all] [--enrich 50] [--out <dossier>] [--name <préfixe>]
      Favoris LiveTrail v3 (index ≥ 500) par sexe, reliés à leur profil UTMB.
      --top all lit tous les inscrits ; seuls les --enrich plus forts sont cherchés sur UTMB.
      ex. livetrail --tenant templiers_2026 --race Templi

  grandraid [--type GRR] [--top 30|all] [--accept <fichier>] [--out <dossier>] [--name <préfixe>] [--max <n>]
      Liste officielle du Grand Raid, chaque inscrit cherché sur UTMB.
      --top all garde toutes les correspondances certaines et envoie les autres inscrits dans <préfixe>-a-verifier.csv.
      --accept lit les correspondances validées à la main (dossard;utmb;…), prises avant la recherche automatique.
      ex. grandraid --type GRR --top all --name diagonale --accept apps/cli/start-list/review/diagonale-acceptes.csv

  sync --api <url graphql> [--dry-run]
      Met les start lists des courses ouvertes à jour depuis leur page de course LiveTrail :
      index, nouveaux inscrits ; les absents sont seulement signalés. Clé admin dans FANTRAIL_ADMIN_API_KEY.
      ex. sync --api https://fantrail-api.onrender.com/graphql --dry-run

Options communes : --cache <dossier> (réponses gardées sur disque), --delay <ms> (pause entre requêtes, 250 par défaut).`;

function sleep(ms: number): Promise<void> {
  return new Promise((done) => setTimeout(done, ms));
}

function printSummary(result: CommandResult, outDir: string): void {
  for (const field of result.fields) {
    console.log(
      `\n${field.label} : ${field.rows.length} coureurs retenus (${field.matchedCount} reliés à UTMB)`,
    );
    field.rows.slice(0, 5).forEach((row, position) => {
      console.log(
        `  ${position + 1}. ${row.firstName} ${row.lastName} (${row.nationality ?? '?'}) ${row.index ?? '—'}`,
      );
    });
  }
  console.log(
    `\n${result.scannedCount} coureurs examinés, ${result.acceptedCount} validés à la main, ${result.unmatchedCount} sans correspondance UTMB certaine dont ${result.leftOutCount} hors CSV, ${result.reviewCount} à vérifier.`,
  );
  result.files.forEach((file) => console.log(`→ ${join(outDir, file.name)}`));
}

async function main(): Promise<void> {
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (!command || flags.has('help')) {
    console.log(USAGE);
    return;
  }
  if (command === 'sync') {
    await runSync(flags);
    return;
  }
  const outDir = resolve(flags.get('out') ?? 'apps/cli/start-list/output');
  const client = new HttpClient({
    fetchImpl: (url, init) => fetch(url, init),
    cacheDir: flags.get('cache') ?? join(tmpdir(), 'fantrail-start-list-cache'),
    delayInMs: intFlag(flags, 'delay', 250),
    retries: 4,
    sleep,
    now: () => Date.now(),
    log: (message) => console.log(message),
  });
  await client.prepare();
  const top = flags.get('top') === 'all' ? 'all' : intFlag(flags, 'top', 30);
  const log = (message: string) => console.log(message);

  let result: CommandResult;
  if (command === 'livetrail') {
    const raceId = requireFlag(flags, 'race');
    result = await buildFromLiveTrail(client, {
      tenant: requireFlag(flags, 'tenant'),
      raceId,
      top,
      filePrefix: flags.get('name') ?? raceId.toLowerCase(),
      log,
      enrichCount: intFlag(flags, 'enrich', 50),
    });
  } else if (command === 'grandraid') {
    const raceType = flags.get('type') ?? 'GRR';
    const maxRegistrants = intFlag(flags, 'max', 0);
    const acceptFile = flags.get('accept');
    result = await buildFromGrandRaid(client, {
      raceType,
      top,
      filePrefix: flags.get('name') ?? raceType.toLowerCase(),
      log,
      accepted: acceptFile
        ? parseAcceptedMatches(await readFile(resolve(acceptFile), 'utf8'))
        : undefined,
      maxRegistrants: maxRegistrants > 0 ? maxRegistrants : undefined,
    });
  } else {
    console.log(`Commande inconnue : ${command}\n\n${USAGE}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(outDir, { recursive: true });
  for (const file of result.files) {
    await writeFile(join(outDir, file.name), file.content, 'utf8');
  }
  printSummary(result, outDir);
  console.log(
    `${client.requestCount} requêtes envoyées (le reste venait du cache).`,
  );
}

async function runSync(flags: Map<string, string>): Promise<void> {
  const apiKey = process.env['FANTRAIL_ADMIN_API_KEY'];
  if (!apiKey) {
    throw new Error('FANTRAIL_ADMIN_API_KEY est obligatoire');
  }
  const log = (message: string) => console.log(message);
  const api = new FantrailApi({
    url: requireFlag(flags, 'api'),
    apiKey,
    fetchImpl: (url, init) =>
      fetch(url, { ...init, signal: AbortSignal.timeout(120_000) }),
    sleep,
    log,
  });
  // Every night reads fresh lists: no disk cache here.
  const client = new HttpClient({
    fetchImpl: (url, init) => fetch(url, init),
    cacheDir: null,
    delayInMs: intFlag(flags, 'delay', 500),
    retries: 2,
    sleep,
    now: () => Date.now(),
    log,
  });
  const report = await syncStartLists(api, client, {
    dryRun: flags.has('dry-run'),
    log,
  });
  const markdown = formatSyncReport(report);
  console.log(`\n${markdown}`);
  const summaryPath = process.env['GITHUB_STEP_SUMMARY'];
  if (summaryPath) {
    await appendFile(summaryPath, markdown, 'utf8');
  }
  if (report.fields.some(({ errors }) => errors.length > 0)) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
