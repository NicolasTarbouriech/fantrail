import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RaceFieldEntity } from './RaceFieldEntity';

@Entity('races')
export class RaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'character varying', length: 100 })
  name!: string;

  @Column({ type: 'date' })
  start_date!: string;

  @Column({ type: 'character varying', length: 100 })
  location!: string;

  @Column({
    type: 'numeric',
    precision: 6,
    scale: 1,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  distance_in_km!: number;

  @Column('integer')
  elevation_gain_in_meters!: number;

  @Column({ type: 'character varying', length: 64 })
  timezone!: string;

  @Column({ type: 'text', nullable: true })
  website_url!: string | null;

  @Column({ type: 'text', nullable: true })
  live_trail_url!: string | null;

  @Column('smallint')
  pick_count!: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  time_tolerance_percent!: number;

  @Index()
  @Column({ type: 'character varying', length: 16 })
  status!: string;

  @OneToMany(() => RaceFieldEntity, (field) => field.race, { cascade: true })
  field_list!: RaceFieldEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
