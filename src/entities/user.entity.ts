import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PresentEntity } from './present.entity';
import { FundingEntity } from './funding.entity';
import { FollowEntity } from './follow.entity';

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'User' })
export class UserEntity {
  // 유저 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // 유저 카카오 고유 id
  @Column('varchar', { unique: true })
  snsId: string;

  // 유저 이름
  @Column('varchar')
  name: string;

  // 유저 닉네임
  @Column('varchar', { length: 30, unique: true })
  nickname: string;

  // 유저 생일
  @Column('date')
  birthday: Date;

  // 유저 은행
  @Column('varchar')
  bank: string;

  // 유저 계좌번호
  @Column('varchar')
  account: string;

  // 유저 이미지
  @Column('varchar')
  profileImgSrc: string;

  // fcm 알림 받을 고유 id
  @Column('varchar', { unique: true })
  fcmId: string;

  // 알람 수신 여부
  @Column('boolean', { default: true })
  alarm: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToMany(() => UserEntity, (users) => users.Followings)
  @JoinTable({
    name: 'Follow',
    joinColumn: {
      name: 'followingId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followerId',
      referencedColumnName: 'id',
    },
  })
  Followers: UserEntity[];

  @ManyToMany(() => UserEntity, (users) => users.Followers)
  Followings: UserEntity[];

  @OneToMany(() => FollowEntity, (following) => following.followingId)
  Following: UserEntity[];

  @OneToMany(() => FollowEntity, (follower) => follower.followingId)
  Follower: UserEntity[];

  // PresentEntity와의 관계
  @OneToMany(() => PresentEntity, (presents) => presents.User)
  Present: PresentEntity[];

  // FudingEntity와의 관계 - 펀딩한 사람
  @OneToMany(() => FundingEntity, (fundings) => fundings.Sender)
  Funding: FundingEntity[];

  // FudingEntity와의 관계 - 펀딩받은 사람
  @OneToMany(() => FundingEntity, (fundings) => fundings.Receiver)
  Funded: FundingEntity[];
}
