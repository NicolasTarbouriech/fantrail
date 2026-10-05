import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { RaceAggregate } from '@trail/modules/race/domain';

import { RaceFieldType } from './RaceFieldType';
import { RaceStatusEnumType } from './enums';

@ObjectType('Race')
export class RaceType {
  constructor(public readonly aggregate: RaceAggregate) {}

  @Field(() => ID)
  get id(): string {
    return this.aggregate.id;
  }

  @Field(() => String)
  get name(): string {
    return this.aggregate.name;
  }

  @Field(() => String, { description: 'Local day of the start, YYYY-MM-DD' })
  get startDate(): string {
    return this.aggregate.startDate;
  }

  @Field(() => String)
  get location(): string {
    return this.aggregate.data.location;
  }

  @Field(() => Float)
  get distanceInKm(): number {
    return this.aggregate.data.distanceInKm;
  }

  @Field(() => Int)
  get elevationGainInMeters(): number {
    return this.aggregate.data.elevationGainInMeters;
  }

  @Field(() => String, {
    description: 'IANA timezone of the race, e.g. Indian/Reunion',
  })
  get timezone(): string {
    return this.aggregate.timezone;
  }

  @Field(() => String, { nullable: true })
  get websiteUrl(): string | null {
    return this.aggregate.data.websiteUrl;
  }

  @Field(() => String, { nullable: true })
  get liveTrailUrl(): string | null {
    return this.aggregate.data.liveTrailUrl;
  }

  @Field(() => Int)
  get pickCount(): number {
    return this.aggregate.pickCount;
  }

  @Field(() => Float)
  get timeTolerancePercent(): number {
    return this.aggregate.timeTolerancePercent;
  }

  @Field(() => RaceStatusEnumType)
  get status(): RaceStatusEnumType {
    return this.aggregate.status;
  }

  @Field(() => [RaceFieldType])
  get fields(): RaceFieldType[] {
    return this.aggregate.fieldList.map((field) => new RaceFieldType(field));
  }
}
