import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import customErrorCode from '../type/custom.error.code';
import {
  CreatePresentDAO,
  CreatePresentResponse,
  DeletePresentResponse,
  PresentWithUser,
  UpdatePresentResponse,
} from '../type/type';
import { FundingEntity } from '../entities/funding.entity';
import { ModelConverter } from '../type/model.converter';
import { CreatePresentRequestDto } from './dto/createPresent.request.dto';
import { UpdatePresentRequestDto } from './dto/updatePresent.request.dto';
import { CreateFundingRequestDto } from './dto/createFunding.request.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PresentsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PresentEntity)
    private presentRepository: Repository<PresentEntity>,
    @InjectRepository(PresentImageEntity)
    private presentImageRepository: Repository<PresentImageEntity>,
    @InjectRepository(FundingEntity)
    private fundingRepository: Repository<FundingEntity>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async createPresent(
    user: UserEntity,
    createPresentDAO: CreatePresentDAO,
    queryRunner: QueryRunner,
  ): Promise<PresentEntity> {
    const {
      name,
      productLink,
      goal,
      deadline,
      representImage,
      shortComment,
      longComment,
    } = createPresentDAO;

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    if (goal <= 0) {
      throw new BadRequestException({
        message: '목표 금액은 0원보다 높아야 합니다!',
        code: customErrorCode.PRESENT_GOAL_SHORT_FALL,
      });
    }

    if (deadline < new Date()) {
      throw new BadRequestException({
        message: '기한은 오늘보다 늦어야 합니다!',
        code: customErrorCode.PRESENT_DEADLINE_SHORT_FALL,
      });
    }

    // TODO: 올해 한개의 게시글만 작성하게 해야하나? 생일 기점 한달 전에만 올릴 수 있게
    // TODO: 펀딩은 선물 한개에 하나만 올릴 수 있게

    return await queryRunner.manager.getRepository(PresentEntity).save({
      name: name,
      productLink: productLink,
      complete: false,
      goal: goal,
      money: 0,
      deadline: deadline,
      representImage: representImage,
      shortComment: shortComment,
      longComment: longComment,
      User: user,
    });
  }

  async createPresentImages(
    present: PresentEntity,
    presentImages: string[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    await Promise.all(
      presentImages.map(async (presentImage) => {
        return queryRunner.manager.getRepository(PresentImageEntity).save({
          Present: present,
          src: presentImage,
        });
      }),
    );
  }

  /**
   * 선물 게시물 생성하기
   * @param userId
   * @param data
   */
  async createPresentPost(
    userId: number,
    data: CreatePresentRequestDto,
  ): Promise<CreatePresentResponse> {
    const { presentImages } = data;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.usersService.findUser('id', userId);

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    try {
      const present = await this.createPresent(user, data, queryRunner);

      await this.createPresentImages(present, presentImages, queryRunner);

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // TODO: 여기에 internal server error
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 내가 팔로잉 하고 있는 사람들의 선물 게시글 가져오기 (10개씩 pagination 적용)
   * @param userId
   * @param page
   */
  async getPresents(userId: number, page: number): Promise<PresentWithUser[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      relations: ['Followings'],
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    const followingIds = user.Followings.map((following) => {
      if (following.deletedAt === null) {
        return following.id;
      }
    });

    if (followingIds.length === 0) {
      return [];
    }

    const presents = await this.dataSource
      .createQueryBuilder(PresentEntity, 'present')
      .innerJoinAndSelect('present.User', 'user')
      .where('present.UserId IN (:...followingIds)', {
        followingIds: [...followingIds],
      })
      .andWhere('present.deletedAt IS NULL')
      .orderBy('present.createdAt', 'DESC')
      .skip(page * 10)
      .take(10)
      .getMany();

    return presents.map((present) => {
      return {
        present: ModelConverter.present(present),
        user: ModelConverter.user(present.User),
      };
    });
  }

  /**
   * 특정 선물 게시물 가져오기
   * @param userId
   * @param presentId
   */
  async getPresent(userId: number, presentId: number) {
    const user = await this.usersService.findUser('id', userId);

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    const present = await this.presentRepository.findOne({
      where: { id: presentId, deletedAt: null },
      relations: ['User', 'PresentImage', 'Funding', 'Funding.Sender'],
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    // 대표이미지 빼고 보내기
    const presentImages = [];
    present.PresentImage.filter(
      (presentImage) => presentImage.src !== present.representImage,
    ).map((presentImage) => {
      presentImages.push(presentImage.src);
    });

    let isParticipate = false;

    const fundings = present.Funding.map((funding) => {
      if (funding.Sender.id == userId) {
        isParticipate = true;
      }

      return {
        funding: ModelConverter.funding(funding),
        user: ModelConverter.user(funding.Sender),
      };
    });

    return {
      user: ModelConverter.user(present.User),
      present: ModelConverter.present(present),
      presentImages: presentImages,
      fundings: fundings,
      isParticipate: isParticipate,
    };
  }

  /**
   * 선물 게시물 수정하기
   * @param userId
   * @param presentId
   * @param data
   */
  async updatePresent(
    userId: number,
    presentId: number,
    data: UpdatePresentRequestDto,
  ): Promise<UpdatePresentResponse> {
    const {
      name,
      productLink,
      goal,
      deadline,
      presentImages,
      representImage,
      shortComment,
      longComment,
    } = data;

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

    if (goal <= 0) {
      throw new BadRequestException({
        message: '목표 금액은 0원보다 높아야 합니다!',
        code: customErrorCode.PRESENT_GOAL_SHORT_FALL,
      });
    }

    if (deadline < new Date()) {
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
      present.name = name;
      present.productLink = productLink;
      present.goal = goal;
      present.deadline = deadline;
      present.representImage = representImage;
      present.shortComment = shortComment;
      present.longComment = longComment;

      // presentImage도 업데이트
      present.PresentImage = await Promise.all(
        presentImages.map(async (presentImage) => {
          return queryRunner.manager.getRepository(PresentImageEntity).save({
            Present: present,
            src: presentImage,
          });
        }),
      );

      await queryRunner.manager.getRepository(PresentEntity).save(present);

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // TODO: 여기에 internal server error
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 선물 게시물 삭제
   * @param userId
   * @param presentId
   */
  async deletePresent(
    userId: number,
    presentId: number,
  ): Promise<DeletePresentResponse> {
    const user = await this.usersService.findUser('id', userId);

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

    // TODO: 돈이 들어 있다면 게시물 취소는 안되게 해야함

    await this.presentRepository.softDelete({ id: presentId });

    return { success: true };
  }
}
