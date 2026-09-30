import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { RaceFieldEntity } from './RaceFieldEntity';

@Entity('runners')
export class RunnerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  field_id!: string;

  @ManyToOne(() => RaceFieldEntity, (field) => field.runner_list, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'field_id' })
  field!: RaceFieldEntity;

  @Column({ type: 'character varying', length: 60 })
  first_name!: string;

  @Column({ type: 'character varying', length: 60 })
  last_name!: string;

  @Column({ type: 'character', length: 3, nullable: true })
  nationality!: string | null;

  @Column({ type: 'smallint', nullable: true })
  index!: number | null;

  @Column({ type: 'character varying', length: 16, nullable: true })
  index_source!: string | null;

  @Column({ type: 'text', nullable: true })
  utmb_url!: string | null;

  @Column({ type: 'text', nullable: true })
  itra_url!: string | null;

  @Column('timestamp with time zone', { nullable: true })
  withdrawn_at!: Date | null;

  @Column('smallint')
  position!: number;
}
