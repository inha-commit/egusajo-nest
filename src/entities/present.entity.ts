import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PresentImageEntity } from './presentImage.entity';
import { FundingEntity } from './funding.entity';

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'Present' })
export class PresentEntity {
  // 생일 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // 생일선물 제품명
  @Column('varchar', { length: 50 })
  name: string;

  // 생일 선물 제품 정보 링크
  @Column({ type: 'varchar', nullable: true })
  productLink: string | null;

  // 펀딩 완료 여부
  @Column('boolean')
  complete: boolean;

  // 펀딩 최종 금액
  @Column('int')
  goal: number;

  // 현재 쌓인 펀딩 금액
  @Column('int')
  money: number;

  // 펀딩 마감일
  @Column('varchar')
  deadline: string;

  // 대표 이미지
  @Column('varchar')
  representImage: string;

  // 짧은 한마디
  @Column('text')
  shortComment: string;

  // 길게 한마디
  @Column('text')
  longComment: string;

  @Column('int', { name: 'UserId', nullable: true })
  UserId: number;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // UserEntity와의 관계
  @ManyToOne(() => UserEntity, (users) => users.Present, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'UserId',
      referencedColumnName: 'id',
    },
  ])
  User: UserEntity;

  // FundingEntity와의 관계
  @OneToMany(() => FundingEntity, (fundings) => fundings.Present, {
    cascade: true,
  })
  Funding: FundingEntity[];

  // PresentImage와의 관계
  @OneToMany(
    () => PresentImageEntity,
    (presentImages) => presentImages.Present,
    {
      cascade: true,
    },
  )
  PresentImage: PresentImageEntity[];
}
