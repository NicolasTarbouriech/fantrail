import { groupRacesByTrailEvent } from '@trail/modules-frontend';
import { Heading, cx } from '@trail/shared/design/ui-react';

import { RaceCardContainer } from './RaceCardContainer';
import type { HomePrediction, HomeRace } from './homeRace';

export type RaceGroupListProps = {
  races: HomeRace[];
  predictionByFieldId: Map<string, HomePrediction>;
  now: Date;
  gridClassName: string;
};

/** Race cards gathered under their trail event: Grand Raid, Festival des Templiers… */
export function RaceGroupList({
  races,
  predictionByFieldId,
  now,
  gridClassName,
}: RaceGroupListProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {groupRacesByTrailEvent(races).map((group) => (
        <section
          key={group.trailEvent?.id ?? 'other'}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2.5">
            {group.trailEvent?.logoUrl ? (
              <img
                src={group.trailEvent.logoUrl}
                alt=""
                className="border-ink size-9 shrink-0 rounded-full border-2 bg-white object-contain"
              />
            ) : null}
            <Heading>{group.trailEvent?.name ?? 'Autres courses'}</Heading>
          </div>
          <div className={cx('grid gap-[18px]', gridClassName)}>
            {group.races.map((race, index) => (
              <RaceCardContainer
                key={race.id}
                race={race}
                predictionByFieldId={predictionByFieldId}
                tone={index % 2 === 0 ? 'primary' : 'ink'}
                now={now}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
