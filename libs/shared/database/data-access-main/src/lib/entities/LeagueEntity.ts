import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LeagueMemberEntity } from './LeagueMemberEntity';
import { UserEntity } from './UserEntity';

export const LEAGUE_NAME_KEY_UNIQUE_INDEX = 'UQ_leagues_name_key';
export const LEAGUE_INVITE_CODE_UNIQUE_INDEX = 'UQ_leagues_invite_code';

@Entity('leagues')
export class LeagueEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'character varying', length: 40 })
  name!: string;

  @Index(LEAGUE_NAME_KEY_UNIQUE_INDEX, { unique: true })
  @Column({ type: 'character varying', length: 80 })
  name_key!: string;

  @Index()
  @Column({ type: 'character varying', length: 16 })
  visibility!: string;

  @Column('uuid')
  owner_id!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: UserEntity;

  @Index(LEAGUE_INVITE_CODE_UNIQUE_INDEX, { unique: true })
  @Column({ type: 'character', length: 8 })
  invite_code!: string;

  @OneToMany(() => LeagueMemberEntity, (member) => member.league, {
    cascade: true,
  })
  member_list!: LeagueMemberEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  race_id_list!: string[];
}
