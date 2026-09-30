import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {
  Bonus,
  BonusType,
  PickScore,
  PlayerFieldScore,
  TimeScore,
} from '@trail/modules/scoring/domain';

registerEnumType(BonusType, { name: 'BonusType' });

@ObjectType('PickScore')
export class PickScoreType {
  constructor(private readonly _pickScore: PickScore) {}

  @Field(() => Int)
  get pickPosition(): number {
    return this._pickScore.pickPosition;
  }

  @Field(() => ID)
  get runnerId(): string {
    return this._pickScore.runnerId;
  }

  @Field(() => Int, {
    nullable: true,
    description: 'Null outside the top 10 or when the runner did not finish',
  })
  get finishPosition(): number | null {
    return this._pickScore.finishPosition;
  }

  @Field(() => Int, { nullable: true })
  get favoriteRank(): number | null {
    return this._pickScore.favoriteRank;
  }

  @Field(() => Int)
  get positionPoints(): number {
    return this._pickScore.positionPoints;
  }

  @Field(() => Float, { description: 'Outsider multiplier, from 1.0 to 2.0' })
  get multiplier(): number {
    return this._pickScore.multiplierInTenths / 10;
  }

  @Field(() => Int)
  get points(): number {
    return this._pickScore.points;
  }
}

@ObjectType('TimeScore')
export class TimeScoreType {
  constructor(private readonly _timeScore: TimeScore) {}

  @Field(() => Int)
  get estimateInSeconds(): number {
    return this._timeScore.estimateInSeconds;
  }

  @Field(() => Int)
  get actualInSeconds(): number {
    return this._timeScore.actualInSeconds;
  }

  @Field(() => Int)
  get gapInSeconds(): number {
    return this._timeScore.gapInSeconds;
  }

  @Field(() => Int)
  get points(): number {
    return this._timeScore.points;
  }
}

@ObjectType('Bonus')
export class BonusScoreType {
  constructor(private readonly _bonus: Bonus) {}

  @Field(() => BonusType)
  get type(): BonusType {
    return this._bonus.type;
  }

  @Field(() => Int)
  get points(): number {
    return this._bonus.points;
  }
}

@ObjectType('Scorecard')
export class ScorecardType {
  constructor(private readonly _score: PlayerFieldScore) {}

  @Field(() => ID)
  get fieldId(): string {
    return this._score.fieldId;
  }

  @Field(() => Int)
  get resultVersion(): number {
    return this._score.resultVersion;
  }

  @Field(() => Int)
  get total(): number {
    return this._score.total;
  }

  @Field(() => [PickScoreType])
  get picks(): PickScoreType[] {
    return this._score.fieldScore.pickScoreList.map(
      (pickScore) => new PickScoreType(pickScore),
    );
  }

  @Field(() => TimeScoreType)
  get time(): TimeScoreType {
    return new TimeScoreType(this._score.fieldScore.timeScore);
  }

  @Field(() => [BonusScoreType])
  get bonuses(): BonusScoreType[] {
    return this._score.fieldScore.bonusList.map(
      (bonus) => new BonusScoreType(bonus),
    );
  }
}
