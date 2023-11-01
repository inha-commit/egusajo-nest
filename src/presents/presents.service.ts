import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import customErrorCode from '../type/custom.error.code';
import {
  CreatePresentResponse,
  DeletePresentResponse,
  UpdatePresentResponse,
} from '../type/type';
import { FundingEntity } from '../entities/funding.entity';
import { ModelConverter } from '../type/model.converter';

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

  async getPresents(userId) {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      relations: ['Followings', 'Followings.Present'],
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // const followingPosts = await this.dataSource
    //   .createQueryBuilder()
    //   .select(['present.id', 'present.createdAt'])
    //   .from(UserEntity, 'user')
    //   .innerJoin('user.Followings', 'following')
    //   .innerJoin('following.Present', 'present')
    //   .where('user.id = :userId', { userId })
    //   .andWhere('user.deletedAt IS NULL')
    //   .orderBy('present.createdAt', 'DESC')
    //   .limit(8)
    //   .getMany();

    // const followers = await this.dataSource
    //   .createQueryBuilder()
    //   .select(['follow.FollowingId'])
    //   .from(UserEntity, 'user')
    //   .innerJoin('Follow', 'follow', 'follow.FollwerId = user.id')
    //   .where('user.id = :userId', { userId: userId }) // YOUR_USER_ID를 원하는 userId로 대체
    //   .andWhere('user.deletedAt IS NULL')
    //   .getMany();

    // const posts = await this.dataSource
    //   .createQueryBuilder()
    //   .select(['present.id', 'present.name']) // 포스트 정보 선택
    //   .from(PresentEntity, 'present')
    //   .innerJoin(UserEntity, 'user', 'user.id = present.UserId')
    //   .where('user.id IN (:...followerIds)', { followerIds }) // 팔로우한 유저들의 ID
    //   .orderBy('present.createdAt', 'DESC') // 시간 순서대로 정렬
    //   .limit(8) // 8개만 가져오기
    //   .getMany(); // 포스트 정보 가져오기
    //
    // console.log(posts);
  }

  /**
   * 특정 선물 게시물 가져오기
   * @param userId
   * @param presentId
   */
  async getPresent(userId: number, presentId: number) {
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

    const fundings = present.Funding.map((funding) => {
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
    };
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
      present.name = name;
      present.productLink = productLink;
      present.goal = goal;
      present.deadline = this.stringToDate(deadline);
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

    // TODO: 돈이 들어 있다면 게시물 취소는 안되게 해야함

    await this.presentRepository.softDelete({ id: presentId });

    return { success: true };
  }

  async createFunding(
    userId: number,
    presentId: number,
    cost: number,
    comment: string,
  ) {
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
      relations: ['User'],
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    if (cost <= 0) {
      throw new BadRequestException({
        message: '금액은 최소 0원 이상이어야 합니다!',
        code: customErrorCode.FUNDING_MONEY_SHORT_FALL,
      });
    }

    if (present.deadline < new Date()) {
      throw new BadRequestException({
        message: '이미 종료된 펀딩입니다!',
        code: customErrorCode.FUNDING_ALREADY_END,
      });
    }

    // TODO: 이미 펀딩을 했다면 불가하게?

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(FundingEntity).save({
        cost: cost,
        comment: comment,
        Present: present,
        Sender: user,
        Receiver: present.User,
      });

      const total_money = present.money + cost;
      let total_complete = present.complete;

      if (total_money >= present.goal) {
        total_complete = true;
      }

      present.money = total_money;
      present.complete = total_complete;

      await queryRunner.manager.getRepository(PresentEntity).save(present);
      // TODO: 여기서 완료된 펀딩에는 조치를 취해야 함

      // TODO: 여기서 펀딩받은 사람에게 알림 보내기
      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // TODO: 여기에 internal server error
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFunding(userId: number, presentId: number, fundId: number) {
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
      relations: ['User'],
    });

    if (!present) {
      throw new BadRequestException({
        message: '존재하지 않는 게시글 입니다!',
        code: customErrorCode.PRESENT_NOT_FOUND,
      });
    }

    const fund = await this.fundingRepository.findOne({
      where: { id: fundId, deletedAt: null },
      relations: ['Sender'],
    });

    if (!fund) {
      throw new BadRequestException({
        message: '존재하지 않는 펀딩 입니다!',
        code: customErrorCode.FUNDING_NOT_FOUND,
      });
    }

    if (fund.Sender.id !== userId) {
      throw new BadRequestException({
        message: '내가 한 펀딩만 취소할 수 있습니다.',
        code: customErrorCode.FUNDING_NOT_MINE,
      });
    }

    if (present.complete === true) {
      throw new BadRequestException({
        message: '완료된 펀딩에 대해서는 취소할 수 없습니다!',
        code: customErrorCode.FUNDING_ALREADY_COMPLETE,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // funding 삭제
      await this.fundingRepository.softDelete({ id: fundId });

      // present에서 money 차감
      const total_money = present.money - fund.cost;
      let total_complete = present.complete;

      if (total_money < present.goal) {
        total_complete = false;
      }

      present.money = total_money;
      present.complete = total_complete;

      await queryRunner.manager.getRepository(PresentEntity).save(present);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // TODO: 여기에 internal server error
    } finally {
      await queryRunner.release();
    }
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
