import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  RaceChoiceList,
  VisibilityOptions,
  getDefaultLeagueRaceIds,
  getInitial,
  getLeagueNameError,
  toggleRace,
} from '@trail/modules-frontend';
import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  Button,
  Callout,
  Heading,
  TextField,
} from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { paths, tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { getErrorMessage } from '../../services/errors';
import {
  useCreateLeaguePageMutateCreateMutation,
  useCreateLeaguePageQuery,
} from '../../services/graphql';
import { toLeagueRaceChoices } from './leagueRaceChoices';

export function CreateLeaguePage() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const [create, createState] = useCreateLeaguePageMutateCreateMutation({
    refetchQueries: ['LeaguesPage', 'HomePage'],
  });
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState(LeagueVisibility.Private);
  const { data } = useCreateLeaguePageQuery();
  const [raceIds, setRaceIds] = useState<string[] | null>(null);
  const races = data?.races ?? [];
  const selectedRaceIds = raceIds ?? getDefaultLeagueRaceIds(races);
  const [error, setError] = useState<string | null>(null);
  const [raceError, setRaceError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nameError = getLeagueNameError(name);
    const missingRace =
      selectedRaceIds.length === 0 ? 'Choisis au moins une course.' : null;
    setError(nameError);
    setRaceError(missingRace);
    if (nameError || missingRace) {
      return;
    }
    try {
      const result = await create({
        variables: { name: name.trim(), visibility, raceIds: selectedRaceIds },
      });
      if (result.data) {
        navigate(paths.league(result.data.createLeague.id), { replace: true });
      }
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <Heading level={1}>Créer une ligue</Heading>
      <form onSubmit={submit} className="flex w-full max-w-xl flex-col gap-5">
        <TextField
          id="league-name"
          label="Nom de la ligue"
          required
          maxLength={40}
          value={name}
          onChange={(event) => setName(event.target.value)}
          hint="3 à 40 caractères. Deux ligues ne peuvent pas porter le même nom, majuscules et accents compris."
          error={error}
        />
        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-2.5 p-0 text-sm font-bold">
            Qui peut la rejoindre ?
          </legend>
          <VisibilityOptions
            name="visibility"
            value={visibility}
            onChange={setVisibility}
          />
        </fieldset>
        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-2.5 p-0 text-sm font-bold">
            Quelles courses compte-t-elle ?
          </legend>
          <RaceChoiceList
            name="races"
            races={toLeagueRaceChoices(races)}
            selectedIds={selectedRaceIds}
            onToggle={(raceId) =>
              setRaceIds(toggleRace(selectedRaceIds, raceId))
            }
          />
          {raceError ? (
            <span className="text-alert text-xs font-semibold">
              {raceError}
            </span>
          ) : null}
        </fieldset>
        <Callout>
          Le classement de ta ligue additionne les courses choisies. Tu en es le
          propriétaire : tu pourras changer ses courses, la renommer, changer sa
          visibilité et retirer des membres.
        </Callout>
        <Button
          type="submit"
          variant="cta"
          size="lg"
          block
          disabled={createState.loading}
        >
          Créer la ligue
        </Button>
      </form>
    </TabPage>
  );
}
