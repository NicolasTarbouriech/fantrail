import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const TRAIL_EVENT_NAME_KEY_UNIQUE_INDEX = 'UQ_trail_events_name_key';

@Entity('trail_events')
export class TrailEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'character varying', length: 60 })
  name!: string;

  @Index(TRAIL_EVENT_NAME_KEY_UNIQUE_INDEX, { unique: true })
  @Column({ type: 'character varying', length: 120 })
  name_key!: string;

  @Column({ type: 'bytea', nullable: true })
  logo!: Buffer | null;

  @Column({ type: 'character varying', length: 32, nullable: true })
  logo_content_type!: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
