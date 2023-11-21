import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PresentEntity } from './present.entity';

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'Funding' })
export class FundingEntity {
  // 펀딩 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // 펀딩 금액
  @Column('int')
  cost: number;

  // 생일자에게 한마디
  @Column('text')
  comment: string;

  @Column('int', { primary: true, name: 'SenderId' })
  SenderId: number;

  @Column('int', { primary: true, name: 'ReceiverId' })
  ReceiverId: number;

  @Column('int', { primary: true, name: 'PresentId' })
  PresentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  // PresentEntity와의 관계
  @ManyToOne(() => PresentEntity, (presents) => presents.Funding, {
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PresentId', referencedColumnName: 'id' }])
  Present: PresentEntity;

  // UserEntity와의 관계 - 펀딩 한 사람
  @ManyToOne(() => UserEntity, (users) => users.Funding, {
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  Sender: UserEntity;

  // UserEntity와의 관계 - 펀딩 받은 사람
  @ManyToOne(() => UserEntity, (users) => users.Funded, {
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  Receiver: UserEntity;
}
