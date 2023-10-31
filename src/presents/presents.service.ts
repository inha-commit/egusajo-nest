import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import customErrorCode from '../type/custom.error.code';
import {
  CreatePresentResponse,
  DeletePresentResponse,
  UpdatePresentResponse,
} from '../type/type';

@Injectable()
export class PresentsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PresentEntity)
    private presentRepository: Repository<PresentEntity>,
    @InjectRepository(PresentImageEntity)
    private presentImageRepository: Repository<PresentImageEntity>,
    private dataSource: DataSource,
  ) {}
  /**
   * 선물 게시물 생성하기
   * @param userId
   * @param name
   * @param productLink
   * @param goal
   * @param deadline
   * @param presentImages
   * @param representImage
   * @param shortComment
   * @param longComment
   */
  async createPresent(
    userId: number,
    name: string,
    productLink: string,
    goal: number,
    deadline: string,
    presentImages: string[],
    representImage: string,
    shortComment: string,
    longComment: string,
  ): Promise<CreatePresentResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    const deadlineDate = this.stringToDate(deadline);

    if (goal <= 0) {
      throw new BadRequestException({
        message: '목표 금액은 0원보다 높아야 합니다!',
        code: customErrorCode.PRESENT_GOAL_SHORT_FALL,
      });
    }

    if (deadlineDate < new Date()) {
      throw new BadRequestException({
        message: '기한은 오늘보다 늦어야 합니다!',
        code: customErrorCode.PRESENT_DEADLINE_SHORT_FALL,
      });
    }

    // TODO: 올해 한개의 게시글만 작성하게 해야하나? 생일 기점 한달 전에만 올릴 수 있게
    // TODO: 펀딩은 선물 한개에 하나만 올릴 수 있게
    try {
      const present = await queryRunner.manager
        .getRepository(PresentEntity)
        .save({
          name: name,
          productLink: productLink,
          complete: false,
          goal: goal,
          money: 0,
          deadline: deadlineDate,
          representImage: representImage,
          shortComment: shortComment,
          longComment: longComment,
          User: user,
        });

      await Promise.all(
        presentImages.map(async (presentImage) => {
          return queryRunner.manager.getRepository(PresentImageEntity).save({
            Present: present,
            src: presentImage,
          });
        }),
      );

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // TODO: 여기에 internal server error
    } finally {
      await queryRunner.release();
    }
  }

  async getPresent(presentId: number) {
    const present = await this.presentRepository.findOne({
      where: { id: presentId, deletedAt: null },
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    // TODO: 여기서 funding이랑 엮어서 댓글들까지 가져와야함
  }

  /**
   * 선물 게시물 수정하기
   * @param userId
   * @param presentId
   * @param name
   * @param productLink
   * @param goal
   * @param deadline
   * @param presentImages
   * @param representImage
   * @param shortComment
   * @param longComment
   */
  async updatePresent(
    userId: number,
    presentId: number,
    name: string,
    productLink: string,
    goal: number,
    deadline: string,
    presentImages: string[],
    representImage: string,
    shortComment: string,
    longComment: string,
  ): Promise<UpdatePresentResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    const present = await this.presentRepository.findOne({
      where: { id: presentId, deletedAt: null },
      relations: ['PresentImage', 'User'],
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    if (present.User.id !== user.id) {
      throw new BadRequestException({
        message: '자신의 게시물만 수정할 수 있습니다',
        code: customErrorCode.PRESENT_NOT_MINE,
      });
    }

    const deadlineDate = this.stringToDate(deadline);

    if (goal <= 0) {
      throw new BadRequestException({
        message: '목표 금액은 0원보다 높아야 합니다!',
        code: customErrorCode.PRESENT_GOAL_SHORT_FALL,
      });
    }

    if (deadlineDate < new Date()) {
      throw new BadRequestException({
        message: '기한은 오늘보다 늦어야 합니다!',
        code: customErrorCode.PRESENT_DEADLINE_SHORT_FALL,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 기존의 이미지 삭제
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PresentImageEntity)
        .where('PresentId = :presentId', { presentId: present.id })
        .execute();

      // present 업데이트
      await this.dataSource
        .createQueryBuilder()
        .update(PresentEntity)
        .set({
          name: name,
          productLink: productLink,
          goal: goal,
          deadline: deadline,
          representImage: representImage,
          shortComment: shortComment,
          longComment: longComment,
          User: user,
        })
        .where('id = :id', { id: presentId })
        .execute();

      // presentImage도 업데이트
      present.PresentImage = await Promise.all(
        presentImages.map(async (presentImage) => {
          return queryRunner.manager.getRepository(PresentImageEntity).save({
            Present: present,
            src: presentImage,
          });
        }),
      );

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // TODO: 여기에 internal server error
    } finally {
      await queryRunner.release();
    }
  }

  async deletePresent(
    userId: number,
    presentId: number,
  ): Promise<DeletePresentResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    const present = await this.presentRepository.findOne({
      where: { id: presentId, deletedAt: null },
      relations: ['PresentImage', 'User'],
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    if (present.User.id !== user.id) {
      throw new BadRequestException({
        message: '자신의 게시물만 수정할 수 있습니다',
        code: customErrorCode.PRESENT_NOT_MINE,
      });
    }

    await this.presentRepository.softDelete({ id: presentId });

    return { success: true };
  }

  stringToDate(deadline: string) {
    // class-validator에서는 string 여부만 막았지만 이상한 문자열이 들어올 수 있으니 방지
    if (isNaN(parseInt(deadline))) {
      throw new BadRequestException({
        message: '잘못된 날짜 형식입니다',
        code: customErrorCode.PRESENT_INVALID_DATE,
      });
    }
    // 문자열을 'YYYY-MM-DD' 형식으로 변환
    const formattedDateString = deadline.replace(
      /(\d{4})(\d{2})(\d{2})/,
      '$1-$2-$3',
    );

    // DateTime 객체로 변환
    return new Date(formattedDateString);
  }
}
