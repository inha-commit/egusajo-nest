import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'Follow' })
export class FollowEntity {
  @Column('int', { primary: true, name: 'followerId' })
  followerId: number;

  @Column('int', { primary: true, name: 'followingId' })
  followingId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.Follower, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'followerId',
      referencedColumnName: 'id',
    },
  ])
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.Following, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'followingId',
      referencedColumnName: 'id',
    },
  ])
  following: UserEntity;
}
