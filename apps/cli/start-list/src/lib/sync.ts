import { z } from 'zod';

import { toAlpha3 } from './countries';
import type { FantrailApi } from './fantrailApi';
import type { HttpClient } from './http';
import {
  type LiveTrailRunner,
  type LiveTrailSex,
  fetchAllLiveTrailRunners,
} from './sources';
import { formatNamePart, nameTokens } from './text';

const StartListRunner = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  nationality: z.string().nullable(),
  index: z.number().nullable(),
  indexSource: z.string().nullable(),
  utmbUrl: z.string().nullable(),
  itraUrl: z.string().nullable(),
  isWithdrawn: z.boolean(),
});
export type StartListRunner = z.infer<typeof StartListRunner>;

const SyncRacesData = z.object({
  adminRaces: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.string(),
      liveTrailUrl: z.string().nullable(),
      fields: z.array(
        z.object({
          id: z.string(),
          gender: z.enum(['Men', 'Women']),
          isLocked: z.boolean(),
          startList: z.object({ runners: z.array(StartListRunner) }),
        }),
      ),
    }),
  ),
});

const SYNC_RACES_QUERY = `query SyncStartLists {
  adminRaces {
    id
    name
    status
    liveTrailUrl
    fields {
      id
      gender
      isLocked
      startList {
        runners { id firstName lastName nationality index indexSource utmbUrl itraUrl isWithdrawn }
      }
    }
  }
}`;

const UPDATE_RUNNER_MUTATION = `mutation SyncUpdateRunner($fieldId: ID!, $runnerId: ID!, $data: RunnerInput!) {
  updateRunner(fieldId: $fieldId, runnerId: $runnerId, data: $data) { fieldId }
}`;

const ADD_RUNNERS_MUTATION = `mutation SyncAddRunners($fieldId: ID!, $dataList: [RunnerInput!]!) {
  addRunners(fieldId: $fieldId, dataList: $dataList) { fieldId }
}`;

const MutationData = z.unknown();

export type RunnerInput = {
  firstName: string;
  lastName: string;
  nationality: string | null;
  index: number | null;
  indexSource: string | null;
  utmbUrl: string | null;
  itraUrl: string | null;
};

export type FieldSyncPlan = {
  liveTrailCount: number;
  updates: { runner: StartListRunner; index: number }[];
  additions: RunnerInput[];
  /** On LiveTrail under a name close to a runner of ours: left for a human. */
  ambiguous: LiveTrailRunner[];
  /** Active runners of ours no longer on LiveTrail: probable withdrawals. */
  missing: StartListRunner[];
  /** Withdrawn runners of ours back on LiveTrail. */
  reappeared: StartListRunner[];
};

export type FieldSyncReport = {
  raceName: string;
  gender: 'Men' | 'Women';
  plan: FieldSyncPlan;
  status: 'applied' | 'dry-run' | 'suspicious';
  errors: string[];
};

export type SyncReport = {
  fields: FieldSyncReport[];
  skipped: string[];
};

const LIVETRAIL_RACE_URL =
  /^https:\/\/([a-z0-9-]+)\.v3\.livetrail\.net\/[a-z-]+\/(\d{4})\/races\/([^/?#]+)/i;

/** https://templiers.v3.livetrail.net/fr/2026/races/Templi → tenant templiers_2026, race Templi */
export function parseLiveTrailRaceUrl(
  url: string | null,
): { tenant: string; raceId: string } | null {
  const match = url ? LIVETRAIL_RACE_URL.exec(url) : null;
  return match
    ? { tenant: `${match[1]}_${match[2]}`, raceId: match[3] ?? '' }
    : null;
}

function nameKey(firstName: string, lastName: string): string {
  return `${nameTokens(firstName).join(' ')}|${nameTokens(lastName).join(' ')}`;
}

function uniqueByBib(runners: LiveTrailRunner[]): LiveTrailRunner[] {
  const seen = new Set<number>();
  return runners.filter((runner) => {
    if (runner.bib === null) {
      return true;
    }
    if (seen.has(runner.bib)) {
      return false;
    }
    seen.add(runner.bib);
    return true;
  });
}

function toRunnerInput(runner: StartListRunner): RunnerInput {
  return {
    firstName: runner.firstName,
    lastName: runner.lastName,
    nationality: runner.nationality,
    index: runner.index,
    indexSource: runner.indexSource,
    utmbUrl: runner.utmbUrl,
    itraUrl: runner.itraUrl,
  };
}

/** Matches LiveTrail runners to ours by name: new index, new registrants, probable withdrawals. */
export function planFieldSync(
  ours: StartListRunner[],
  liveTrailRunners: LiveTrailRunner[],
): FieldSyncPlan {
  const theirs = uniqueByBib(liveTrailRunners);
  const oursByKey = new Map<string, StartListRunner[]>();
  for (const runner of ours) {
    const key = nameKey(runner.firstName, runner.lastName);
    oursByKey.set(key, [...(oursByKey.get(key) ?? []), runner]);
  }
  const lastNameInitials = new Set(
    ours.map(
      (runner) =>
        `${nameTokens(runner.lastName).join(' ')}|${nameTokens(runner.firstName)[0]?.[0] ?? ''}`,
    ),
  );
  const matchedIds = new Set<string>();
  const plan: FieldSyncPlan = {
    liveTrailCount: theirs.length,
    updates: [],
    additions: [],
    ambiguous: [],
    missing: [],
    reappeared: [],
  };
  for (const runner of theirs) {
    const nationality = toAlpha3(runner.countryCode);
    const candidates = (
      oursByKey.get(nameKey(runner.firstName, runner.lastName)) ?? []
    ).filter(({ id }) => !matchedIds.has(id));
    const match =
      candidates.find((candidate) => candidate.nationality === nationality) ??
      candidates[0];
    if (match) {
      matchedIds.add(match.id);
      if (match.isWithdrawn) {
        plan.reappeared.push(match);
      } else if (runner.index !== null && runner.index !== match.index) {
        plan.updates.push({ runner: match, index: runner.index });
      }
      continue;
    }
    const closeKey = `${nameTokens(runner.lastName).join(' ')}|${nameTokens(runner.firstName)[0]?.[0] ?? ''}`;
    if (lastNameInitials.has(closeKey)) {
      plan.ambiguous.push(runner);
      continue;
    }
    plan.additions.push({
      firstName: formatNamePart(runner.firstName),
      lastName: formatNamePart(runner.lastName),
      nationality,
      index: runner.index,
      indexSource: runner.index === null ? null : 'Utmb',
      utmbUrl: null,
      itraUrl: null,
    });
  }
  plan.missing = ours.filter(
    (runner) => !runner.isWithdrawn && !matchedIds.has(runner.id),
  );
  return plan;
}

/** Below this index, registrations and withdrawals come and go every day: they are applied without a second look. */
export const SIGNIFICANT_INDEX = 600;
const MAX_SIGNIFICANT_MOVE_RATIO = 0.15;
const MIN_SIGNIFICANT_MOVE_LIMIT = 5;

export function isSignificant({ index }: { index: number | null }): boolean {
  return index !== null && index >= SIGNIFICANT_INDEX;
}

/** A LiveTrail hiccup must not flood a start list: big moves among the strong runners wait for a human. */
export function isSuspicious(
  plan: FieldSyncPlan,
  ours: StartListRunner[],
): boolean {
  const significantCount = ours.filter(
    (runner) => !runner.isWithdrawn && isSignificant(runner),
  ).length;
  const limit = Math.max(
    MIN_SIGNIFICANT_MOVE_LIMIT,
    Math.ceil(significantCount * MAX_SIGNIFICANT_MOVE_RATIO),
  );
  return (
    plan.additions.filter(isSignificant).length > limit ||
    plan.missing.filter(isSignificant).length > limit
  );
}

const ADD_BATCH_SIZE = 200;

export type SyncOptions = {
  dryRun: boolean;
  log: (message: string) => void;
};

async function applyPlan(
  api: FantrailApi,
  fieldId: string,
  plan: FieldSyncPlan,
): Promise<string[]> {
  const errors: string[] = [];
  for (const { runner, index } of plan.updates) {
    try {
      await api.request(
        UPDATE_RUNNER_MUTATION,
        {
          fieldId,
          runnerId: runner.id,
          data: {
            ...toRunnerInput(runner),
            index,
            indexSource: runner.indexSource ?? 'Utmb',
          },
        },
        MutationData,
      );
    } catch (error) {
      errors.push(
        `${runner.firstName} ${runner.lastName} : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  for (let start = 0; start < plan.additions.length; start += ADD_BATCH_SIZE) {
    try {
      await api.request(
        ADD_RUNNERS_MUTATION,
        {
          fieldId,
          dataList: plan.additions.slice(start, start + ADD_BATCH_SIZE),
        },
        MutationData,
      );
    } catch (error) {
      errors.push(
        `ajout de coureurs : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return errors;
}

const SEX_BY_GENDER: Record<'Men' | 'Women', LiveTrailSex> = {
  Men: 'MALE',
  Women: 'FEMALE',
};

/** Brings every open, unlocked field in line with its LiveTrail race. */
export async function syncStartLists(
  api: FantrailApi,
  client: HttpClient,
  { dryRun, log }: SyncOptions,
): Promise<SyncReport> {
  await api.waitUntilAwake();
  const { adminRaces } = await api.request(SYNC_RACES_QUERY, {}, SyncRacesData);
  const report: SyncReport = { fields: [], skipped: [] };
  for (const race of adminRaces) {
    if (race.status !== 'Open') {
      continue;
    }
    const liveTrail = parseLiveTrailRaceUrl(race.liveTrailUrl);
    if (!liveTrail) {
      report.skipped.push(`${race.name} : pas de page de course LiveTrail`);
      continue;
    }
    for (const field of race.fields) {
      const label = `${race.name} · ${field.gender === 'Men' ? 'hommes' : 'femmes'}`;
      if (field.isLocked) {
        report.skipped.push(`${label} : verrouillé`);
        continue;
      }
      const liveTrailRunners = await fetchAllLiveTrailRunners(client, {
        ...liveTrail,
        sex: SEX_BY_GENDER[field.gender],
      });
      if (liveTrailRunners.length === 0) {
        report.skipped.push(`${label} : liste LiveTrail vide`);
        continue;
      }
      const runners = field.startList.runners;
      const plan = planFieldSync(runners, liveTrailRunners);
      const suspicious = isSuspicious(plan, runners);
      log(
        `${label} : ${plan.updates.length} index, ${plan.additions.length} ajouts, ${plan.missing.length} absents${suspicious ? ' (suspect, rien écrit)' : ''}`,
      );
      const errors =
        dryRun || suspicious ? [] : await applyPlan(api, field.id, plan);
      report.fields.push({
        raceName: race.name,
        gender: field.gender,
        plan,
        status: suspicious ? 'suspicious' : dryRun ? 'dry-run' : 'applied',
        errors,
      });
    }
  }
  return report;
}

function fullName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): string {
  return `${firstName} ${lastName}`;
}

const STATUS_LABELS: Record<FieldSyncReport['status'], string> = {
  applied: 'appliqué',
  'dry-run': 'simulation, rien écrit',
  suspicious: 'suspect, rien écrit',
};

/** Markdown for the job summary: what changed, and what a human should look at. */
export function formatSyncReport(report: SyncReport): string {
  const lines = ['## Synchro des start lists avec LiveTrail', ''];
  lines.push(
    `| Champ | LiveTrail | Index | Ajouts | Absents ${SIGNIFICANT_INDEX}+ | À vérifier | État |`,
  );
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const field of report.fields) {
    const { plan } = field;
    lines.push(
      `| ${field.raceName} · ${field.gender === 'Men' ? 'hommes' : 'femmes'} | ${plan.liveTrailCount} | ${plan.updates.length} | ${plan.additions.length} | ${plan.missing.filter(isSignificant).length} | ${plan.ambiguous.length + plan.reappeared.length} | ${STATUS_LABELS[field.status]}${field.errors.length ? `, ${field.errors.length} erreurs` : ''} |`,
    );
  }
  for (const field of report.fields) {
    const label = `${field.raceName} · ${field.gender === 'Men' ? 'hommes' : 'femmes'}`;
    const { plan } = field;
    const significantMissing = plan.missing.filter(isSignificant);
    const otherMissingCount = plan.missing.length - significantMissing.length;
    if (significantMissing.length) {
      lines.push(
        '',
        `**${label} : absents de LiveTrail à ${SIGNIFICANT_INDEX}+, forfaits probables**`,
      );
      lines.push(
        ...significantMissing.map(
          (runner) => `- ${fullName(runner)} (${runner.index})`,
        ),
      );
    }
    if (otherMissingCount > 0) {
      lines.push(
        '',
        `${label} : ${otherMissingCount} autres absents sous ${SIGNIFICANT_INDEX} ou sans index.`,
      );
    }
    if (plan.ambiguous.length) {
      lines.push(
        '',
        `**${label} : nouveaux noms proches d'un coureur existant**`,
      );
      lines.push(...plan.ambiguous.map((runner) => `- ${fullName(runner)}`));
    }
    if (plan.reappeared.length) {
      lines.push('', `**${label} : retirés mais de nouveau sur LiveTrail**`);
      lines.push(...plan.reappeared.map((runner) => `- ${fullName(runner)}`));
    }
    if (field.errors.length) {
      lines.push('', `**${label} : erreurs**`);
      lines.push(...field.errors.map((error) => `- ${error}`));
    }
  }
  if (report.skipped.length) {
    lines.push('', '**Ignorés**', ...report.skipped.map((line) => `- ${line}`));
  }
  return `${lines.join('\n')}\n`;
}
