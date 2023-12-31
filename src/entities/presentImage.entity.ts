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
import { PresentEntity } from './present.entity';

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'PresentImage' })
export class PresentImageEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // 이미지 저장소 주소
  @Column('varchar')
  src: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // PresentEntity와의 관계
  @ManyToOne(() => PresentEntity, (presents) => presents.PresentImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PresentId', referencedColumnName: 'id' }])
  Present: PresentEntity;
}
