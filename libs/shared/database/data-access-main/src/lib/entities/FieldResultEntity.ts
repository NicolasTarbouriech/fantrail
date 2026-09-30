import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { RaceFieldEntity } from './RaceFieldEntity';

// One row per published version: corrections append, nothing is overwritten.
@Entity('field_results')
export class FieldResultEntity {
  @PrimaryColumn('uuid')
  field_id!: string;

  @PrimaryColumn('integer')
  version!: number;

  @ManyToOne(() => RaceFieldEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field!: RaceFieldEntity;

  @Column('jsonb')
  ranking_list!: string[];

  @Column('integer')
  winner_time_in_seconds!: number;

  @Column('jsonb')
  dnf_runner_id_list!: string[];

  @Column('timestamp with time zone')
  published_at!: Date;
}
