import { type ChangeEvent, type FormEvent, useState } from 'react';

import { TrailEventTag } from '@trail/modules-frontend';
import type { TrailEventInput } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { cx } from '@trail/shared/design/ui-react';
import {
  AdminButton,
  AdminDialog,
  AdminField,
  AdminInput,
  AdminNotice,
  adminButtonClasses,
} from '@trail/shared/design/ui-react-admin';

import { readLogoFile } from './readLogoFile';

export type TrailEventDialogProps = {
  trailEvent: { name: string; logoUrl: string | null } | null;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: TrailEventInput) => void;
  onClose: () => void;
};

/** Creates or edits an event; the tag is previewed on both race card colors. */
export function TrailEventDialog({
  trailEvent,
  isSaving,
  error,
  onSubmit,
  onClose,
}: TrailEventDialogProps) {
  const [name, setName] = useState(trailEvent?.name ?? '');
  const [logoUrl, setLogoUrl] = useState(trailEvent?.logoUrl ?? null);
  const [isReading, setReading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const chooseLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    setLocalError(null);
    setReading(true);
    try {
      setLogoUrl(await readLogoFile(file));
    } catch (caught) {
      setLocalError(
        caught instanceof Error ? caught.message : 'Image illisible.',
      );
    } finally {
      setReading(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setLocalError('Le nom doit faire au moins 2 caractères.');
      return;
    }
    setLocalError(null);
    onSubmit({ name: name.trim(), logoDataUrl: logoUrl });
  };

  const previewName = name.trim() || 'Nom de l’événement';

  return (
    <AdminDialog
      open
      title={trailEvent ? `Modifier ${trailEvent.name}` : 'Nouvel événement'}
      description="Affiché en tag sur les cartes des courses rattachées."
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            Annuler
          </AdminButton>
          <AdminButton
            type="submit"
            form="trail-event-form"
            variant="primary"
            disabled={isSaving || isReading}
          >
            {trailEvent ? 'Enregistrer' : 'Créer l’événement'}
          </AdminButton>
        </>
      }
    >
      <form
        id="trail-event-form"
        onSubmit={submit}
        className="flex flex-col gap-4"
      >
        <AdminField id="trail-event-name" label="Nom">
          <AdminInput
            id="trail-event-name"
            value={name}
            maxLength={60}
            onChange={(event) => setName(event.target.value)}
            placeholder="Festival des Templiers"
          />
        </AdminField>
        <AdminField
          id="trail-event-logo"
          label="Logo"
          hint="PNG, JPEG, WebP ou SVG. Réduit à 256 px avant l’envoi, 100 Ko au plus. Il s’affiche sur fond blanc."
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo actuel"
                  className="size-full object-contain"
                />
              ) : (
                <span className="text-xs text-zinc-400">Aucun</span>
              )}
            </span>
            <label
              className={cx(adminButtonClasses('outline', 'sm'), 'relative')}
            >
              {isReading
                ? 'Lecture…'
                : logoUrl
                  ? 'Changer le logo'
                  : 'Choisir un logo'}
              <input
                id="trail-event-logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only"
                onChange={chooseLogo}
              />
            </label>
            {logoUrl ? (
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setLogoUrl(null)}
              >
                Retirer
              </AdminButton>
            ) : null}
          </div>
        </AdminField>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-950">Aperçu</span>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="bg-primary flex min-w-0 rounded-lg p-3">
              <TrailEventTag name={previewName} logoUrl={logoUrl} />
            </div>
            <div className="bg-ink flex min-w-0 rounded-lg p-3">
              <TrailEventTag name={previewName} logoUrl={logoUrl} />
            </div>
          </div>
        </div>
        {localError || error ? (
          <AdminNotice tone="danger">{localError ?? error}</AdminNotice>
        ) : null}
      </form>
    </AdminDialog>
  );
}
