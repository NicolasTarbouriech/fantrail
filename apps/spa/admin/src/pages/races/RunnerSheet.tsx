import { type FormEvent, useState } from 'react';

import { formatMultiplier, getMultiplier } from '@trail/modules-frontend';
import {
  IndexSource,
  type RunnerInput,
} from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminDialog,
  AdminField,
  AdminInput,
  AdminNotice,
  AdminSelect,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRunner } from './raceTypes';

const SOURCE_OPTIONS = [
  { value: IndexSource.Utmb, label: 'UTMB' },
  { value: IndexSource.Itra, label: 'ITRA' },
  { value: IndexSource.Betrail, label: 'Betrail' },
  { value: IndexSource.Manual, label: 'Manuel' },
];

function isIndexSource(value: string): value is IndexSource {
  return SOURCE_OPTIONS.some((option) => option.value === value);
}

export type RunnerSheetProps = {
  open: boolean;
  fieldLabel: string;
  runner: AdminRunner | null;
  canWithdraw: boolean;
  isPending: boolean;
  error: string | null;
  onSave: (input: RunnerInput) => void;
  onWithdraw: () => void;
  onClose: () => void;
};

export function RunnerSheet({
  open,
  fieldLabel,
  runner,
  canWithdraw,
  isPending,
  error,
  onSave,
  onWithdraw,
  onClose,
}: RunnerSheetProps) {
  const [firstName, setFirstName] = useState(runner?.firstName ?? '');
  const [lastName, setLastName] = useState(runner?.lastName ?? '');
  const [nationality, setNationality] = useState(runner?.nationality ?? '');
  const [index, setIndex] = useState(runner?.index ? String(runner.index) : '');
  const [source, setSource] = useState<IndexSource>(
    runner?.indexSource ?? IndexSource.Utmb,
  );
  const [utmbUrl, setUtmbUrl] = useState(runner?.utmbUrl ?? '');
  const [itraUrl, setItraUrl] = useState(runner?.itraUrl ?? '');
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setLocalError('Prénom et nom obligatoires.');
      return;
    }
    if (nationality && !/^[A-Za-z]{3}$/.test(nationality.trim())) {
      setLocalError('Nationalité : code à 3 lettres (FRA).');
      return;
    }
    if (index && !/^\d+$/.test(index.trim())) {
      setLocalError('L’index est un nombre entier.');
      return;
    }
    setLocalError(null);
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationality: nationality.trim() ? nationality.trim().toUpperCase() : null,
      index: index.trim() ? Number(index.trim()) : null,
      indexSource: index.trim() ? source : null,
      utmbUrl: utmbUrl.trim() || null,
      itraUrl: itraUrl.trim() || null,
    });
  };

  return (
    <AdminDialog
      open={open}
      side="right"
      title={runner ? 'Modifier le coureur' : 'Ajouter un coureur'}
      description={fieldLabel}
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            Annuler
          </AdminButton>
          <AdminButton
            type="submit"
            form="runner-form"
            variant="primary"
            disabled={isPending}
          >
            Enregistrer
          </AdminButton>
        </>
      }
    >
      <form id="runner-form" onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField id="runner-first-name" label="Prénom">
            <AdminInput
              id="runner-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </AdminField>
          <AdminField id="runner-last-name" label="Nom">
            <AdminInput
              id="runner-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </AdminField>
        </div>
        <AdminField
          id="runner-nationality"
          label="Nationalité"
          hint="Code à 3 lettres : FRA, ESP, ITA…"
        >
          <div className="w-28">
            <AdminInput
              id="runner-nationality"
              maxLength={3}
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
              className="uppercase"
            />
          </div>
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField id="runner-index" label="Index">
            <AdminInput
              id="runner-index"
              inputMode="numeric"
              value={index}
              onChange={(event) => setIndex(event.target.value)}
              className="tabular-nums"
            />
          </AdminField>
          <AdminField id="runner-source" label="Source de l’index">
            <AdminSelect
              id="runner-source"
              value={source}
              onChange={(event) => {
                if (isIndexSource(event.target.value)) {
                  setSource(event.target.value);
                }
              }}
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </div>
        <p className="m-0 -mt-1 text-[13px] text-zinc-500">
          {runner?.favoriteRank
            ? `Favori n°${runner.favoriteRank} aujourd’hui, soit un multiplicateur de ${formatMultiplier(getMultiplier(runner.favoriteRank))}. `
            : ''}
          Laisse l’index vide si le coureur n’en a pas : ×1.0.
        </p>
        <AdminField id="runner-utmb" label="Lien UTMB">
          <AdminInput
            id="runner-utmb"
            type="url"
            value={utmbUrl}
            onChange={(event) => setUtmbUrl(event.target.value)}
            placeholder="https://utmb.world/runner/…"
          />
        </AdminField>
        <AdminField id="runner-itra" label="Lien ITRA">
          <AdminInput
            id="runner-itra"
            type="url"
            value={itraUrl}
            onChange={(event) => setItraUrl(event.target.value)}
            placeholder="https://itra.run/…"
          />
        </AdminField>
        {localError || error ? (
          <AdminNotice tone="danger">{localError ?? error}</AdminNotice>
        ) : null}
      </form>
      {runner && canWithdraw && !runner.isWithdrawn ? (
        <AdminCard tone="danger" className="p-4">
          <AdminCardHeader
            title="Retirer de la start list"
            description="Forfait avant le départ. Il reste dans les pronos qui le contiennent et y vaut 0 point. Les joueurs concernés voient une alerte et peuvent le remplacer jusqu’au verrouillage."
          />
          <AdminButton
            variant="destructive"
            className="self-start"
            onClick={onWithdraw}
            disabled={isPending}
          >
            Retirer {runner.fullName}
          </AdminButton>
        </AdminCard>
      ) : null}
    </AdminDialog>
  );
}
