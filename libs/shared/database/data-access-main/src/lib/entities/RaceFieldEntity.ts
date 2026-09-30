import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { RaceEntity } from './RaceEntity';
import { RunnerEntity } from './RunnerEntity';

@Entity('race_fields')
@Index(['race_id', 'gender'], { unique: true })
export class RaceFieldEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  race_id!: string;

  @ManyToOne(() => RaceEntity, (race) => race.field_list, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'race_id' })
  race!: RaceEntity;

  @Column({ type: 'character varying', length: 16 })
  gender!: string;

  @Column('timestamp with time zone')
  start_at!: Date;

  @Column('timestamp with time zone')
  lock_at!: Date;

  @Column('timestamp with time zone', { nullable: true })
  locked_at!: Date | null;

  @OneToMany(() => RunnerEntity, (runner) => runner.field, { cascade: true })
  runner_list!: RunnerEntity[];
}
