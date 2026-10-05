import { Navigate, Route, Routes } from 'react-router-dom';

import { PlayerFrame } from '@trail/shell/fantrail';

import { RequireAuth } from '../auth/RequireAuth';
import { JoinPage } from '../pages/auth/JoinPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { HomePage } from '../pages/home/HomePage';
import { CommunityPage } from '../pages/leagues/CommunityPage';
import { CreateLeaguePage } from '../pages/leagues/CreateLeaguePage';
import { LeaguePage } from '../pages/leagues/LeaguePage';
import { LeagueSettingsPage } from '../pages/leagues/LeagueSettingsPage';
import { LeaguesPage } from '../pages/leagues/LeaguesPage';
import { PredictionPage } from '../pages/prediction/PredictionPage';
import { PointsPage } from '../pages/profile/PointsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { ScorecardPage } from '../pages/scores/ScorecardPage';
import { ScoresPage } from '../pages/scores/ScoresPage';
import { SignedInLayout } from './SignedInLayout';
import { paths } from './paths';

export function App() {
  return (
    <PlayerFrame>
      <Routes>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<RegisterPage />} />
        <Route path="/join/:inviteCode" element={<JoinPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<SignedInLayout />}>
            <Route path={paths.home} element={<HomePage />} />
            <Route
              path="/courses/:raceId/:fieldSlug?"
              element={<PredictionPage />}
            />
            <Route path={paths.leagues} element={<LeaguesPage />} />
            <Route path={paths.createLeague} element={<CreateLeaguePage />} />
            <Route path={paths.community} element={<CommunityPage />} />
            <Route path="/ligues/:leagueId" element={<LeaguePage />} />
            <Route
              path="/ligues/:leagueId/reglages"
              element={<LeagueSettingsPage />}
            />
            <Route path={paths.scores} element={<ScoresPage />} />
            <Route
              path="/scores/:raceId/:fieldSlug"
              element={<ScorecardPage />}
            />
            <Route path={paths.profile} element={<ProfilePage />} />
            <Route path={paths.points} element={<PointsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </PlayerFrame>
  );
}
