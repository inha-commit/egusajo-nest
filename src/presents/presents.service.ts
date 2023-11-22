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
  PresentWithFund,
  PresentWithUser,
  UpdatePresentDAO,
  UpdatePresentResponse,
} from '../type/type';
import { FundingEntity } from '../entities/funding.entity';
import { ModelConverter } from '../type/model.converter';
import { CreatePresentRequestDto } from './dto/createPresent.request.dto';
import { UpdatePresentRequestDto } from './dto/updatePresent.request.dto';
import { UsersService } from '../users/users.service';
import { dateToKoreaString, stringDateToKoreaString } from '../hooks/date';

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

  /**
   * 선물 생성하기
   * @param user
   * @param createPresentDAO
   * @param queryRunner
   */
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
      presentImages,
    } = createPresentDAO;

    const present = await queryRunner.manager
      .getRepository(PresentEntity)
      .save({
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

    await this.createPresentImages(present, presentImages, queryRunner);

    return present;
  }

  /**
   * 선물 이미지 생성하기
   * @param present
   * @param presentImages
   * @param queryRunner
   */
  async createPresentImages(
    present: PresentEntity,
    presentImages: string[],
    queryRunner: QueryRunner,
  ): Promise<PresentImageEntity[]> {
    return await Promise.all(
      presentImages.map(async (presentImage) => {
        return queryRunner.manager.getRepository(PresentImageEntity).save({
          Present: present,
          src: presentImage,
        });
      }),
    );
  }

  /**
   * 선물 가져오기
   * @param property
   * @param value
   * @param relations
   */
  async findPresent(
    property: string,
    value: string | number,
    relations: string[] | null,
  ): Promise<PresentEntity> {
    const present = await this.presentRepository.findOne({
      where: { [property]: value, deletedAt: null },
      relations: relations,
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    return present;
  }

  /**
   * 선물들 가져오기
   * @param property
   * @param value
   * @param relations
   * @param skip
   * @param take
   */
  async findPresents(
    property: string,
    value: string | number,
    relations: string[] | null,
    skip: number,
    take: number,
  ): Promise<PresentEntity[]> {
    return await this.presentRepository.find({
      where: { [property]: value, deletedAt: null },
      relations: relations,
      skip: skip,
      take: take,
    });
  }

  async updatePresent(
    user: UserEntity,
    present: PresentEntity,
    updatePresentDAO: UpdatePresentDAO,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const {
      name,
      productLink,
      goal,
      deadline,
      presentImages,
      representImage,
      shortComment,
      longComment,
    } = updatePresentDAO;

    await this.deletePresentImages(present.id, queryRunner);

    present.name = name;
    present.productLink = productLink;
    present.goal = goal;
    present.deadline = deadline;
    present.representImage = representImage;
    present.shortComment = shortComment;
    present.longComment = longComment;
    present.PresentImage = await this.createPresentImages(
      present,
      presentImages,
      queryRunner,
    );

    await queryRunner.manager.getRepository(PresentEntity).save(present);
  }

  async deletePresentImages(
    presentId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(PresentImageEntity)
      .where('PresentId = :presentId', { presentId: presentId })
      .execute();
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
    const { goal, deadline } = data;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.usersService.findUser('id', userId, null);

    if (goal <= 0) {
      throw new BadRequestException({
        message: '목표 금액은 0원보다 높아야 합니다!',
        code: customErrorCode.PRESENT_GOAL_SHORT_FALL,
      });
    }

    // 오늘보다 기한 늦으면 안되게 하기
    if (stringDateToKoreaString(deadline) < dateToKoreaString(new Date())) {
      throw new BadRequestException({
        message: '기한은 오늘보다 늦어야 합니다!',
        code: customErrorCode.PRESENT_DEADLINE_SHORT_FALL,
      });
    }

    const present = await this.presentRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    // 한해에 하나의 게시물만 작성 가능하게 막기
    if (present?.createdAt.getFullYear() === new Date().getFullYear()) {
      throw new BadRequestException({
        message: '한해에 한개의 게시물만 작성할 수 있습니다!',
        code: customErrorCode.PRESENT_ONLY_ONE_IN_YEAR,
      });
    }

    try {
      await this.createPresent(user, data, queryRunner);

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 내가 팔로잉 하고 있는 사람들의 선물 게시글 가져오기 (10개씩 pagination 적용)
   * @param userId
   * @param page
   */
  async getPresentPosts(
    userId: number,
    page: number,
  ): Promise<PresentWithUser[]> {
    const user = await this.usersService.findUser('id', userId, ['Followings']);

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
  async getPresentPost(
    userId: number,
    presentId: number,
  ): Promise<PresentWithFund> {
    await this.usersService.findUser('id', userId, null);

    const present = await this.findPresent('id', presentId, [
      'User',
      'PresentImage',
      'Funding',
      'Funding.Sender',
    ]);

    // 대표이미지 빼고 보내기
    const presentImages: string[] = [];
    present.PresentImage.filter(
      (presentImage) => presentImage.src !== present.representImage,
    ).map((presentImage) => {
      presentImages.push(presentImage.src);
    });

    // 내가 펀딩에 참여했는지 확인
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
   * 나의 선물 게시물 가져오기
   * @param userId
   * @param page
   */
  async getMyPresentPosts(
    userId: number,
    page: number,
  ): Promise<PresentWithUser[]> {
    await this.usersService.findUser('id', userId, null);

    const presents = await this.findPresents(
      'UserId',
      userId,
      ['User'],
      page * 10,
      10,
    );

    if (presents.length === 0) return [];

    return presents.map((present) => {
      return {
        present: ModelConverter.present(present),
        user: ModelConverter.user(present.User),
      };
    });
  }

  /**
   * 선물 게시물 수정하기
   * @param userId
   * @param presentId
   * @param data
   */
  async updatePresentPost(
    userId: number,
    presentId: number,
    data: UpdatePresentRequestDto,
  ): Promise<UpdatePresentResponse> {
    const { goal, deadline } = data;

    const user = await this.usersService.findUser('id', userId, null);

    const present = await this.findPresent('id', presentId, [
      'PresentImage',
      'User',
    ]);

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

    // 오늘보다 기한 늦으면 안되게 하기
    if (stringDateToKoreaString(deadline) < dateToKoreaString(new Date())) {
      throw new BadRequestException({
        message: '기한은 오늘보다 늦어야 합니다!',
        code: customErrorCode.PRESENT_DEADLINE_SHORT_FALL,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.updatePresent(user, present, data, queryRunner);

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
    const user = await this.usersService.findUser('id', userId, null);

    const present = await this.findPresent('id', presentId, ['User']);

    if (present.User.id !== user.id) {
      throw new BadRequestException({
        message: '자신의 게시물만 삭제할 수 있습니다',
        code: customErrorCode.PRESENT_NOT_MINE,
      });
    }

    // TODO: 돈이 들어 있다면 게시물 취소는 안되게 해야함

    await this.presentRepository.delete({ id: presentId });

    return { success: true };
  }
}
