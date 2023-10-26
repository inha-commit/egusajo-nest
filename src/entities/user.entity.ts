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

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'User' })
export class UserEntity {
  // 유저 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // 유저 카카오 고유 id
  @Column('varchar', { unique: true })
  snsId: string;

  // 유저 닉네임
  @Column('varchar', { length: 30, unique: true })
  nickname: string;

  // 유저 생일
  @Column('varchar', { length: 8 })
  birthday: string;

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

  // 친구관계 테이블 설정
  @ManyToMany(() => UserEntity, (users) => users.Followings)
  @JoinTable({
    name: 'Follow',
    joinColumn: {
      name: 'FollowingId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'FollwerId',
      referencedColumnName: 'id',
    },
  })
  Followers: UserEntity[];

  @ManyToMany(() => UserEntity, (users) => users.Followers)
  Followings: UserEntity[];

  // PresentEntity와의 관계
  @OneToMany(() => PresentEntity, (presents) => presents.User)
  Present: PresentEntity[];

  // UserImageEntity와의 관계
  // @OneToOne(() => UserImageEntity, (userImages) => userImages.User)
  // @JoinColumn([{ name: 'UserImageId', referencedColumnName: 'id' }])
  // UserImage: UserImageEntity;

  // FudingEntity와의 관계 - 펀딩한 사람
  @OneToMany(() => FundingEntity, (fundings) => fundings.Sender)
  Funding: FundingEntity[];

  // FudingEntity와의 관계 - 펀딩받은 사람
  @OneToMany(() => FundingEntity, (fundings) => fundings.Receiver)
  Funded: FundingEntity[];
}
