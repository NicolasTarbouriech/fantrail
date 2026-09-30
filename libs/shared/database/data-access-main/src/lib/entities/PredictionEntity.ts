import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RaceFieldEntity } from './RaceFieldEntity';
import { UserEntity } from './UserEntity';

export const PREDICTION_USER_FIELD_UNIQUE_INDEX = 'UQ_predictions_user_field';

@Entity('predictions')
@Index(PREDICTION_USER_FIELD_UNIQUE_INDEX, ['user_id', 'field_id'], {
  unique: true,
})
export class PredictionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Index()
  @Column('uuid')
  field_id!: string;

  @ManyToOne(() => RaceFieldEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field!: RaceFieldEntity;

  @Column('jsonb')
  pick_list!: (string | null)[];

  @Column('integer', { nullable: true })
  winner_time_estimate_in_seconds!: number | null;

  @Column('timestamp with time zone', { nullable: true })
  finalized_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
