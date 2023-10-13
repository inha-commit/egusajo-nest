import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ schema: `${process.env.DATABASE_NAME}`, name: 'UserImage' })
export class UserImageEntity {
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

  // UserEntity와의 관계
  @OneToOne(() => UserEntity, (users) => users.UserImage)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: UserEntity;
}
