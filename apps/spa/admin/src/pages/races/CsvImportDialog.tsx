import { type ChangeEvent, useMemo, useState } from 'react';

import {
  START_LIST_CSV_HEADER,
  parseStartListCsv,
} from '@trail/modules-frontend';
import type { RunnerInput } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { cx } from '@trail/shared/design/ui-react';
import {
  AdminButton,
  AdminDialog,
  AdminNotice,
  AdminTable,
  AdminTd,
  AdminTextarea,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRunner } from './raceTypes';

const PREVIEW_READY_LINES = 50;

export type CsvImportDialogProps = {
  open: boolean;
  fieldLabel: string;
  existingRunners: AdminRunner[];
  isPending: boolean;
  error: string | null;
  onImport: (runners: RunnerInput[]) => void;
  onClose: () => void;
};

export function CsvImportDialog({
  open,
  fieldLabel,
  existingRunners,
  isPending,
  error,
  onImport,
  onClose,
}: CsvImportDialogProps) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const result = useMemo(
    () => parseStartListCsv(text, existingRunners),
    [text, existingRunners],
  );

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setText(await file.text());
    }
  };

  const readyCount = result.readyRunners.length;
  const problemLines = result.lines.filter((line) => line.state !== 'ready');
  const readyLines = result.lines.filter((line) => line.state === 'ready');
  const previewLines = [
    ...problemLines,
    ...readyLines.slice(0, PREVIEW_READY_LINES),
  ];
  const hiddenReadyCount = Math.max(readyLines.length - PREVIEW_READY_LINES, 0);

  return (
    <AdminDialog
      open={open}
      wide
      title="Importer des coureurs"
      description={fieldLabel}
      onClose={onClose}
      footer={
        <>
          <span className="mr-auto text-[13px] text-zinc-600">
            {result.lines.length === 0
              ? 'Colle le contenu du fichier ou choisis-le.'
              : `${readyCount} prêt${readyCount > 1 ? 's' : ''} · ${result.errorCount} erreur${result.errorCount > 1 ? 's' : ''} · ${result.duplicateCount} doublon${result.duplicateCount > 1 ? 's' : ''} ignoré${result.duplicateCount > 1 ? 's' : ''}`}
          </span>
          <AdminButton variant="outline" onClick={onClose}>
            Annuler
          </AdminButton>
          <AdminButton
            variant="primary"
            disabled={readyCount === 0 || isPending}
            onClick={() => onImport(result.readyRunners)}
          >
            Importer {readyCount} coureur{readyCount > 1 ? 's' : ''}
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-2 text-[13px] text-zinc-600">
        <span>
          Colonnes attendues, dans cet ordre, séparées par « ; » ou « , » :
        </span>
        <code className="rounded-md bg-zinc-100 px-2.5 py-1.5 font-mono text-xs text-zinc-950">
          {START_LIST_CSV_HEADER}
        </code>
        <span>
          Nationalité en code à 3 lettres (FRA). Source : utmb, itra, betrail ou
          manuel. Index, source et liens peuvent rester vides. Les lignes en
          erreur ne sont pas importées.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium hover:bg-zinc-50">
          Choisir un fichier .csv
          <input
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={readFile}
            className="sr-only"
          />
        </label>
        {fileName ? (
          <span className="text-[13px] text-zinc-600">{fileName}</span>
        ) : null}
      </div>
      <AdminTextarea
        aria-label="Contenu CSV"
        placeholder={`${START_LIST_CSV_HEADER}\nLéo;Martin;FRA;912;utmb;;`}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      {result.lines.length > 0 ? (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Ligne</AdminTh>
              <AdminTh>Coureur</AdminTh>
              <AdminTh>Nat.</AdminTh>
              <AdminTh className="text-right">Index</AdminTh>
              <AdminTh>Source</AdminTh>
              <AdminTh>État</AdminTh>
            </tr>
          </thead>
          <tbody>
            {previewLines.map((line) => (
              <tr
                key={line.lineNumber}
                className={cx(
                  line.state === 'error' && 'bg-red-50',
                  line.state === 'duplicate' && 'bg-zinc-50',
                )}
              >
                <AdminTd className="text-zinc-500 tabular-nums">
                  {line.lineNumber}
                </AdminTd>
                <AdminTd className="font-semibold">
                  {line.fullName || '—'}
                </AdminTd>
                <AdminTd>{line.nationality || '—'}</AdminTd>
                <AdminTd className="text-right tabular-nums">
                  {line.index || '—'}
                </AdminTd>
                <AdminTd>{line.source || '—'}</AdminTd>
                <AdminTd
                  className={cx(
                    'text-[13px] font-semibold',
                    line.state === 'error' && 'text-red-700',
                    line.state !== 'error' && 'text-zinc-500',
                  )}
                >
                  {line.message}
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}
      {hiddenReadyCount > 0 ? (
        <p className="m-0 text-center text-[13px] text-zinc-500">
          … et {hiddenReadyCount} autres lignes prêtes.
        </p>
      ) : null}
      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}
    </AdminDialog>
  );
}
