import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  FIELD_GENDER_ORDER,
  findGenderBySlug,
  getFieldLabel,
  getFieldSlug,
  isRaceEditable,
} from '@trail/modules-frontend';
import {
  Gender,
  type RunnerInput,
} from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { PlusIcon } from '@trail/shared/design/ui-react';
import {
  ADMIN_SEGMENTED_GROUP_CLASSES,
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminNotice,
  adminSegmentClasses,
} from '@trail/shared/design/ui-react-admin';

import { getErrorMessage } from '../../services/errors';
import {
  useFieldsTabMutateAddFieldMutation,
  useFieldsTabMutateAddRunnersMutation,
  useFieldsTabMutateLockFieldMutation,
  useFieldsTabMutateReinstateRunnerMutation,
  useFieldsTabMutateUpdateFieldMutation,
  useFieldsTabMutateUpdateRunnerMutation,
  useFieldsTabMutateWithdrawRunnerMutation,
} from '../../services/graphql';
import { ConfirmDialog } from './ConfirmDialog';
import { CsvImportDialog } from './CsvImportDialog';
import { FieldSettingsCard } from './FieldSettingsCard';
import { RunnerSheet } from './RunnerSheet';
import { StartListTable } from './StartListTable';
import type { AdminRace, AdminRunner } from './raceTypes';

type Panel =
  | { kind: 'runner'; runner: AdminRunner | null }
  | { kind: 'csv' }
  | { kind: 'lock' }
  | null;

export function FieldsTab({ race }: { race: AdminRace }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const gender =
    findGenderBySlug(searchParams.get('champ') ?? undefined) ?? Gender.Men;
  const field =
    race.fields.find((candidate) => candidate.gender === gender) ?? null;
  const [panel, setPanel] = useState<Panel>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [addField, addFieldState] = useFieldsTabMutateAddFieldMutation();
  const [updateField, updateFieldState] =
    useFieldsTabMutateUpdateFieldMutation();
  const [lockField, lockFieldState] = useFieldsTabMutateLockFieldMutation();
  const [addRunners, addRunnersState] = useFieldsTabMutateAddRunnersMutation();
  const [updateRunner, updateRunnerState] =
    useFieldsTabMutateUpdateRunnerMutation();
  const [withdrawRunner, withdrawState] =
    useFieldsTabMutateWithdrawRunnerMutation();
  const [reinstateRunner] = useFieldsTabMutateReinstateRunnerMutation();

  const isEditable = isRaceEditable(race.status);
  const canEditRunners = isEditable && Boolean(field) && !field?.isLocked;
  const runners = field?.startList.runners ?? [];
  const activeCount = runners.filter((runner) => !runner.isWithdrawn).length;
  const fieldLabel = `${race.name} · ${getFieldLabel(gender)}`;

  const run = async (action: () => Promise<unknown>, success?: string) => {
    setError(null);
    setNotice(null);
    try {
      await action();
      setPanel(null);
      if (success) {
        setNotice(success);
      }
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  const saveRunner = (input: RunnerInput) => {
    if (!field || panel?.kind !== 'runner') {
      return;
    }
    const runner = panel.runner;
    void run(() =>
      runner
        ? updateRunner({
            variables: { fieldId: field.id, runnerId: runner.id, data: input },
          })
        : addRunners({ variables: { fieldId: field.id, dataList: [input] } }),
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        role="group"
        aria-label="Champ"
        className={ADMIN_SEGMENTED_GROUP_CLASSES}
      >
        {FIELD_GENDER_ORDER.map((candidate) => (
          <button
            key={candidate}
            type="button"
            aria-pressed={candidate === gender}
            onClick={() => {
              setError(null);
              setNotice(null);
              setSearchParams(
                { champ: getFieldSlug(candidate) },
                { replace: true },
              );
            }}
            className={adminSegmentClasses(candidate === gender)}
          >
            {getFieldLabel(candidate)}
          </button>
        ))}
      </div>
      {notice ? <AdminNotice tone="success">{notice}</AdminNotice> : null}
      <FieldSettingsCard
        key={`${gender}-${field?.id ?? 'new'}-${field?.startAt ?? ''}-${field?.lockAt ?? ''}`}
        race={race}
        gender={gender}
        field={field}
        isEditable={isEditable}
        isPending={addFieldState.loading || updateFieldState.loading}
        error={panel ? null : error}
        onSave={(startAt, lockAt) =>
          void run(
            () =>
              field
                ? updateField({
                    variables: {
                      fieldId: field.id,
                      data: { gender, startAt, lockAt },
                    },
                  })
                : addField({
                    variables: {
                      raceId: race.id,
                      data: { gender, startAt, lockAt },
                    },
                  }),
            field
              ? 'Champ enregistré.'
              : 'Champ ajouté : importe maintenant sa start list.',
          )
        }
        onLock={() => setPanel({ kind: 'lock' })}
      />
      {field ? (
        <AdminCard className="gap-3 p-0">
          <div className="px-5 pt-5">
            <AdminCardHeader
              title="Start list"
              description={`${activeCount} coureurs actifs · ${runners.length - activeCount} retirés · triés par rang de favori`}
              action={
                canEditRunners ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <AdminButton
                      variant="outline"
                      onClick={() => setPanel({ kind: 'csv' })}
                    >
                      Importer un CSV
                    </AdminButton>
                    <AdminButton
                      variant="primary"
                      onClick={() => setPanel({ kind: 'runner', runner: null })}
                    >
                      <PlusIcon size={16} />
                      Ajouter un coureur
                    </AdminButton>
                  </div>
                ) : null
              }
            />
          </div>
          <div className="px-5 pb-5">
            <StartListTable
              runners={runners}
              canEdit={canEditRunners}
              onEdit={(runner) => setPanel({ kind: 'runner', runner })}
              onReinstate={(runner) =>
                void run(() =>
                  reinstateRunner({
                    variables: { fieldId: field.id, runnerId: runner.id },
                  }),
                )
              }
            />
            <p className="m-0 mt-2 text-[13px] text-zinc-500">
              Sans index : multiplicateur ×1.0. Le rang de favori se recalcule à
              chaque changement et se fige au verrouillage.
            </p>
          </div>
        </AdminCard>
      ) : null}
      {panel?.kind === 'runner' ? (
        <RunnerSheet
          open
          key={panel.runner?.id ?? 'new'}
          fieldLabel={fieldLabel}
          runner={panel.runner}
          canWithdraw={canEditRunners}
          isPending={
            addRunnersState.loading ||
            updateRunnerState.loading ||
            withdrawState.loading
          }
          error={error}
          onSave={saveRunner}
          onWithdraw={() => {
            const runner = panel.runner;
            if (field && runner) {
              void run(
                () =>
                  withdrawRunner({
                    variables: { fieldId: field.id, runnerId: runner.id },
                  }),
                `${runner.fullName} est retiré : ses picks valent 0 point.`,
              );
            }
          }}
          onClose={() => setPanel(null)}
        />
      ) : null}
      {panel?.kind === 'csv' && field ? (
        <CsvImportDialog
          open
          fieldLabel={fieldLabel}
          existingRunners={runners}
          isPending={addRunnersState.loading}
          error={error}
          onImport={(dataList) =>
            void run(
              () => addRunners({ variables: { fieldId: field.id, dataList } }),
              `${dataList.length} coureurs importés.`,
            )
          }
          onClose={() => setPanel(null)}
        />
      ) : null}
      <ConfirmDialog
        open={panel?.kind === 'lock'}
        title={`Verrouiller ${getFieldLabel(gender).toLowerCase()} ?`}
        confirmLabel="Verrouiller maintenant"
        isPending={lockFieldState.loading}
        error={error}
        onConfirm={() =>
          field &&
          void run(
            () => lockField({ variables: { fieldId: field.id } }),
            'Champ verrouillé.',
          )
        }
        onClose={() => setPanel(null)}
      >
        Plus aucun joueur ne pourra modifier son prono sur ce champ, et les
        pronos deviennent visibles dans les ligues.
      </ConfirmDialog>
    </div>
  );
}
