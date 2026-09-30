import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const USER_EMAIL_UNIQUE_INDEX = 'UQ_users_email';
export const USER_PSEUDO_KEY_UNIQUE_INDEX = 'UQ_users_pseudo_key';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index(USER_EMAIL_UNIQUE_INDEX, { unique: true })
  @Column({ type: 'character varying', length: 254 })
  email!: string;

  @Column({ type: 'character varying', length: 20 })
  pseudo!: string;

  @Index(USER_PSEUDO_KEY_UNIQUE_INDEX, { unique: true })
  @Column({ type: 'character varying', length: 40 })
  pseudo_key!: string;

  @Column('text')
  password_hash!: string;

  @Column({ type: 'character varying', length: 16 })
  role!: string;

  @Column('timestamp with time zone', { nullable: true })
  disabled_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
