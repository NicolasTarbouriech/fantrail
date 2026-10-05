import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAdmin } from '../auth/RequireAdmin';
import { LoginPage } from '../pages/auth/LoginPage';
import { LeaguePage } from '../pages/leagues/LeaguePage';
import { LeaguesPage } from '../pages/leagues/LeaguesPage';
import { PlayersPage } from '../pages/players/PlayersPage';
import { RacePage } from '../pages/races/RacePage';
import { RacesPage } from '../pages/races/RacesPage';
import { AdminLayout } from './AdminLayout';
import { paths } from './paths';

export function App() {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path={paths.races} element={<RacesPage />} />
          <Route path={paths.newRace} element={<RacePage />} />
          <Route path="/courses/:raceId/:tab?" element={<RacePage />} />
          <Route path={paths.leagues} element={<LeaguesPage />} />
          <Route path="/ligues/:leagueId" element={<LeaguePage />} />
          <Route path={paths.players} element={<PlayersPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={paths.races} replace />} />
    </Routes>
  );
}
