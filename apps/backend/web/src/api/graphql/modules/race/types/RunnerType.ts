import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { Runner } from '@trail/modules/race/domain';

import { IndexSourceEnumType } from './enums';

@ObjectType('Runner')
export class RunnerType {
  constructor(
    public readonly runner: Runner,
    private readonly _favoriteRank: number | null,
  ) {}

  @Field(() => ID)
  get id(): string {
    return this.runner.id;
  }

  @Field(() => String)
  get firstName(): string {
    return this.runner.firstName;
  }

  @Field(() => String)
  get lastName(): string {
    return this.runner.lastName;
  }

  @Field(() => String)
  get fullName(): string {
    return this.runner.fullName;
  }

  @Field(() => String, {
    nullable: true,
    description: 'ISO 3166-1 alpha-3 code',
  })
  get nationality(): string | null {
    return this.runner.data.nationality;
  }

  @Field(() => Int, { nullable: true })
  get index(): number | null {
    return this.runner.index;
  }

  @Field(() => IndexSourceEnumType, { nullable: true })
  get indexSource(): IndexSourceEnumType | null {
    return this.runner.data.indexSource;
  }

  @Field(() => String, { nullable: true })
  get utmbUrl(): string | null {
    return this.runner.data.utmbUrl;
  }

  @Field(() => String, { nullable: true })
  get itraUrl(): string | null {
    return this.runner.data.itraUrl;
  }

  @Field(() => Boolean)
  get isWithdrawn(): boolean {
    return this.runner.isWithdrawn;
  }

  @Field(() => Date, { nullable: true })
  get withdrawnAt(): Date | null {
    return this.runner.withdrawnAt;
  }

  @Field(() => Int, {
    nullable: true,
    description: '1 = best index among active runners',
  })
  get favoriteRank(): number | null {
    return this._favoriteRank;
  }
}
