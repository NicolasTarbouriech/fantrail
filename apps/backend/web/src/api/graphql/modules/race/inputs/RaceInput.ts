import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RaceInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  location: string;

  @Field(() => Float)
  distanceInKm: number;

  @Field(() => Int)
  elevationGainInMeters: number;

  @Field(() => String, {
    description: 'IANA timezone of the race, e.g. Europe/Paris',
  })
  timezone: string;

  @Field(() => String, { nullable: true })
  websiteUrl?: string | null;

  @Field(() => String, { nullable: true })
  liveTrailUrl?: string | null;

  @Field(() => Int, { description: '3 or 5' })
  pickCount: number;

  @Field(() => Float)
  timeTolerancePercent: number;
}
