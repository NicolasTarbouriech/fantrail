import { getRaceStatusLabel } from '@trail/modules-frontend';
import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { LockIcon } from '@trail/shared/design/ui-react';
import {
  AdminBadge,
  type AdminBadgeTone,
} from '@trail/shared/design/ui-react-admin';

const TONES: Record<RaceStatus, AdminBadgeTone> = {
  [RaceStatus.Draft]: 'outline',
  [RaceStatus.Open]: 'primary',
  [RaceStatus.Locked]: 'neutral',
  [RaceStatus.Scored]: 'gold',
  [RaceStatus.Cancelled]: 'danger',
};

export function RaceStatusBadge({ status }: { status: RaceStatus }) {
  return (
    <AdminBadge tone={TONES[status]}>
      {status === RaceStatus.Locked ? <LockIcon size={12} /> : null}
      {getRaceStatusLabel(status)}
    </AdminBadge>
  );
}
