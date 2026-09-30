import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { RaceFieldEntity } from './RaceFieldEntity';
import { UserEntity } from './UserEntity';

export interface FieldScoreBreakdown {
  pickScoreList: {
    pickPosition: number;
    runnerId: string;
    finishPosition: number | null;
    favoriteRank: number | null;
    positionPoints: number;
    multiplierInTenths: number;
    points: number;
  }[];
  timeScore: {
    estimateInSeconds: number;
    actualInSeconds: number;
    toleranceInSeconds: number;
    points: number;
  };
  bonusList: { type: string; points: number }[];
}

@Entity('field_scores')
export class FieldScoreEntity {
  @PrimaryColumn('uuid')
  field_id!: string;

  @Index()
  @PrimaryColumn('uuid')
  user_id!: string;

  @ManyToOne(() => RaceFieldEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field!: RaceFieldEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column('integer')
  result_version!: number;

  @Column('integer')
  total!: number;

  @Column('integer')
  time_gap_in_seconds!: number;

  @Column('timestamp with time zone')
  finalized_at!: Date;

  @Column('jsonb')
  breakdown!: FieldScoreBreakdown;
}
