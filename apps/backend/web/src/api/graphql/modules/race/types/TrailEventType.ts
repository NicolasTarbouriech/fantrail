import { Field, ID, ObjectType } from '@nestjs/graphql';

import { TrailEventAggregate } from '@trail/modules/race/domain';

@ObjectType('TrailEvent', {
  description: 'Festival or raid gathering several races, shown as a tag',
})
export class TrailEventType {
  constructor(public readonly aggregate: TrailEventAggregate) {}

  @Field(() => ID)
  get id(): string {
    return this.aggregate.id;
  }

  @Field(() => String)
  get name(): string {
    return this.aggregate.name;
  }

  @Field(() => String, {
    nullable: true,
    description: 'Base64 data URL of the logo, small enough to inline',
  })
  get logoUrl(): string | null {
    const logo = this.aggregate.logo;
    return logo
      ? `data:${logo.contentType};base64,${Buffer.from(logo.bytes).toString('base64')}`
      : null;
  }
}
