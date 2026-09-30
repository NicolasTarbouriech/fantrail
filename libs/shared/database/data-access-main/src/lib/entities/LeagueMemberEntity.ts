import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { LeagueEntity } from './LeagueEntity';
import { UserEntity } from './UserEntity';

@Entity('league_members')
export class LeagueMemberEntity {
  @PrimaryColumn('uuid')
  league_id!: string;

  @Index()
  @PrimaryColumn('uuid')
  user_id!: string;

  @ManyToOne(() => LeagueEntity, (league) => league.member_list, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'league_id' })
  league!: LeagueEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column('timestamp with time zone')
  joined_at!: Date;
}
