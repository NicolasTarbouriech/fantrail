import { Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  countPicks,
  findGenderBySlug,
  formatCountdown,
  formatDayTime,
  formatStartTime,
  getFieldShortLabel,
  getFieldSlug,
  sortByGender,
} from '@trail/modules-frontend';
import {
  Callout,
  CheckIcon,
  Hero,
  LockIcon,
  PillTabs,
  Spinner,
  Sticker,
} from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';
import { useNow } from '../../hooks/useNow';
import { usePredictionPageQuery } from '../../services/graphql';
import { LockedPrediction } from './LockedPrediction';
import { PredictionForm } from './PredictionForm';

export function PredictionPage() {
  const navigate = useNavigate();
  const { raceId = '', fieldSlug } = useParams();
  const now = useNow();
  const { data, loading, error } = usePredictionPageQuery({
    variables: { raceId },
  });

  if (loading && !data) {
    return <Spinner />;
  }
  if (error || !data) {
    return (
      <DetailPage
        hero={
          <Hero
            title="Course introuvable"
            leading={<BackLink to={paths.home} label="Retour à l’accueil" />}
          />
        }
      >
        <Callout tone="warning">
          Cette course n’existe pas ou n’est plus ouverte.
        </Callout>
      </DetailPage>
    );
  }

  const race = data.race;
  const fields = sortByGender(race.fields);
  const gender = findGenderBySlug(fieldSlug);
  const field = fields.find((candidate) => candidate.gender === gender);
  if (!field) {
    return fields[0] ? (
      <Navigate
        to={paths.prediction(race.id, getFieldSlug(fields[0].gender))}
        replace
      />
    ) : (
      <Navigate to={paths.home} replace />
    );
  }

  const predictionByFieldId = new Map(
    data.myPredictions.map((prediction) => [prediction.fieldId, prediction]),
  );
  const saved = predictionByFieldId.get(field.id) ?? null;
  const isLocked = field.isLocked || new Date(field.lockAt) <= now;
  const fieldTabs =
    fields.length > 1 ? (
      <PillTabs
        label="Champ"
        tabs={fields.map((candidate) => {
          const prediction = predictionByFieldId.get(candidate.id);
          const filled = prediction ? countPicks(prediction.pickList) : 0;
          return {
            id: candidate.id,
            selected: candidate.id === field.id,
            onSelect: () =>
              navigate(
                paths.prediction(race.id, getFieldSlug(candidate.gender)),
                {
                  replace: true,
                },
              ),
            label: (
              <>
                {getFieldShortLabel(candidate.gender)}
                {prediction?.isComplete ? (
                  <CheckIcon
                    size={15}
                    className={
                      candidate.id === field.id
                        ? 'text-highlight'
                        : 'text-primary'
                    }
                  />
                ) : filled > 0 ? (
                  <span className="font-sans text-xs font-bold opacity-70">
                    {filled}/{race.pickCount}
                  </span>
                ) : null}
              </>
            ),
          };
        })}
      />
    ) : null;

  return (
    <DetailPage
      hero={
        <Hero
          leading={<BackLink to={paths.home} label="Retour à l’accueil" />}
          trailing={
            isLocked ? (
              <Sticker tone="ink">
                <LockIcon size={15} />
                Verrouillé
              </Sticker>
            ) : (
              <Sticker>
                Clôture dans {formatCountdown(field.lockAt, now)}
              </Sticker>
            )
          }
          title={race.name}
          subtitle={
            isLocked
              ? `Départ donné ${formatDayTime(field.startAt)}`
              : [
                  `${Math.round(race.distanceInKm)} km`,
                  `${race.elevationGainInMeters.toLocaleString('fr-FR')} m D+`,
                  formatStartTime(field.startAt, race.timezone),
                ].join(' · ')
          }
        />
      }
    >
      {isLocked ? (
        <LockedPrediction
          race={race}
          field={field}
          saved={saved}
          fieldTabs={fieldTabs}
        />
      ) : (
        <PredictionForm
          key={`${field.id}-${saved?.updatedAt ?? 'new'}`}
          race={race}
          field={field}
          saved={saved}
          fieldTabs={fieldTabs}
        />
      )}
    </DetailPage>
  );
}
