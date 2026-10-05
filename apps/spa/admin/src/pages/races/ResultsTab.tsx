import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  FIELD_GENDER_ORDER,
  findGenderBySlug,
  formatDayTime,
  getFieldLabel,
  getFieldSlug,
} from '@trail/modules-frontend';
import { Gender } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  ADMIN_SEGMENTED_GROUP_CLASSES,
  AdminNotice,
  adminSegmentClasses,
} from '@trail/shared/design/ui-react-admin';

import { getErrorMessage } from '../../services/errors';
import { useResultsTabMutatePublishMutation } from '../../services/graphql';
import { ResultForm } from './ResultForm';
import type { AdminRace } from './raceTypes';

export function ResultsTab({ race }: { race: AdminRace }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const gender =
    findGenderBySlug(searchParams.get('champ') ?? undefined) ?? Gender.Men;
  const field =
    race.fields.find((candidate) => candidate.gender === gender) ?? null;
  const [publish, publishState] = useResultsTabMutatePublishMutation({
    refetchQueries: ['RacePage'],
  });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const publishResult = async (
    rankingList: string[],
    winnerTimeInSeconds: number,
  ) => {
    if (!field) {
      return false;
    }
    setError(null);
    try {
      const result = await publish({
        variables: { fieldId: field.id, rankingList, winnerTimeInSeconds },
      });
      const published = result.data?.publishFieldResult;
      setNotice(
        published?.publishedAt
          ? `Version ${published.version} publiée ${formatDayTime(published.publishedAt)} : les scores sont recalculés.`
          : 'Résultat publié.',
      );
      return true;
    } catch (caught) {
      setError(getErrorMessage(caught));
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        role="group"
        aria-label="Champ"
        className={ADMIN_SEGMENTED_GROUP_CLASSES}
      >
        {FIELD_GENDER_ORDER.map((candidate) => {
          const candidateField = race.fields.find(
            (item) => item.gender === candidate,
          );
          return (
            <button
              key={candidate}
              type="button"
              aria-pressed={candidate === gender}
              onClick={() => {
                setNotice(null);
                setError(null);
                setSearchParams(
                  { champ: getFieldSlug(candidate) },
                  { replace: true },
                );
              }}
              className={adminSegmentClasses(candidate === gender)}
            >
              {getFieldLabel(candidate)}
              {candidateField?.result
                ? ` · v${candidateField.result.version}`
                : ''}
            </button>
          );
        })}
      </div>
      {notice ? <AdminNotice tone="success">{notice}</AdminNotice> : null}
      {field ? (
        <ResultForm
          key={`${field.id}-${field.result?.version ?? 0}`}
          field={field}
          isPending={publishState.loading}
          error={error}
          onPublish={publishResult}
        />
      ) : (
        <AdminNotice>
          Ce champ n’existe pas encore : ajoute-le dans « Champs et start lists
          ».
        </AdminNotice>
      )}
    </div>
  );
}
