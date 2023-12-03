import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFundingRequestDto } from '../presents/dto/createFunding.request.dto';
import customErrorCode from '../../filters/custom.error.code';
import { FundingEntity } from '../../entities/funding.entity';
import { PresentEntity } from '../../entities/present.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../../entities/user.entity';
import {
  CreateFundDAO,
  CreateFundResponse,
  DeleteFundResponse,
} from '../../type/type';
import { ModelConverter } from '../../type/model.converter';
import { PresentsService } from '../presents/presents.service';
import { AuthService } from '../auth/auth.service';
import { dateToKoreaString, stringDateToKoreaString } from '../../hooks/date';
import { FcmService } from '../fcm/fcm.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FundsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PresentEntity)
    private presentRepository: Repository<PresentEntity>,
    @InjectRepository(FundingEntity)
    private fundingRepository: Repository<FundingEntity>,
    private authService: AuthService,
    private usersService: UsersService,
    private presentsService: PresentsService,
    private fcmService: FcmService,
    private redisService: RedisService,
    private dataSource: DataSource,
  ) {}

  async createFund(
    createFundDAO: CreateFundDAO,
    present: PresentEntity,
    sender: UserEntity,
    receiver: UserEntity,
    queryRunner: QueryRunner,
  ): Promise<FundingEntity> {
    const { cost, comment } = createFundDAO;

    return await queryRunner.manager.getRepository(FundingEntity).save({
      cost: cost,
      comment: comment,
      Present: present,
      Sender: sender,
      Receiver: receiver,
    });
  }

  async findFund(
    property: string,
    value: string | number,
    relations: string[] | null,
  ): Promise<FundingEntity> {
    const fund = await this.fundingRepository.findOne({
      where: { [property]: value, deletedAt: null },
      relations: relations,
    });

    if (!fund) {
      throw new BadRequestException({
        message: '존재하지 않는 펀딩 입니다!',
        code: customErrorCode.FUNDING_NOT_FOUND,
      });
    }

    return fund;
  }

  async findFunds(
    property: string,
    value: string | number,
    relations: string[] | null,
    skip: number,
    take: number,
  ): Promise<FundingEntity[]> {
    return this.fundingRepository.find({
      where: { [property]: value, deletedAt: null },
      relations: relations,
      skip: skip,
      take: take,
    });
  }

  async deleteFund(fundId: number, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(FundingEntity, {
      id: fundId,
    });
  }

  async Funding(
    userId: number,
    presentId: number,
    data: CreateFundingRequestDto,
  ): Promise<CreateFundResponse> {
    const { cost } = data;

    const user = await this.usersService.findUser('id', userId, null);

    const present = await this.presentsService.findPresent('id', presentId, [
      'User',
    ]);

    // 자신은 자신에게 펀딩이 불가능하게
    if (userId === present.User.id) {
      throw new BadRequestException({
        message: '왜 자신에게 선물하려 하세요!',
        code: customErrorCode.FUNDING_TO_ME,
      });
    }

    // 기한이 지난 게시물에 대해선 펀딩 불가능하게함
    if (
      stringDateToKoreaString(present.deadline) < dateToKoreaString(new Date())
    ) {
      throw new BadRequestException({
        message: '이미 종료된 펀딩입니다!',
        code: customErrorCode.FUNDING_ALREADY_END,
      });
    }

    // 100원 이하의 금액의 경우에는 불가능하게함
    if (cost < 100) {
      throw new BadRequestException({
        message: '금액은 최소 100원 이상이어야 합니다!',
        code: customErrorCode.FUNDING_MONEY_SHORT_FALL,
      });
    }

    const alreadyFund = await this.fundingRepository.findOne({
      where: { PresentId: present.id, SenderId: userId, deletedAt: null },
    });

    // 해당 펀딩에 참여한 경우에는 불가능하게함
    if (alreadyFund) {
      throw new BadRequestException({
        message: '이미 해당 펀딩에 참여하였습니다!',
        code: customErrorCode.FUNDING_ALREADY_PARTICIPATE,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.createFund(data, present, user, present.User, queryRunner);

      await this.presentsService.updatePresentMoney(
        present,
        cost,
        'plus',
        queryRunner,
      );

      await queryRunner.commitTransaction();

      const fcmToken = await this.redisService.getFcmToken(present.User.id);

      // 펀딩 받은 사람에게 알람 보내기
      if (fcmToken && present.User.alarm) {
        this.fcmService.sendNewFundingNotification(
          user.nickname,
          cost,
          fcmToken,
        );
      }

      // 펀딩 완료된 사람에게 알람 보내기
      if (present.complete && fcmToken && present.User.alarm) {
        this.fcmService.sendCompleteFundingNotification(fcmToken);
      }

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getFundingHistory(userId: number, page: number) {
    await this.usersService.findUser('id', userId, null);

    const fundingHistories = await this.findFunds(
      'SenderId',
      userId,
      ['Present'],
      page * 10,
      10,
    );

    if (fundingHistories.length === 0) return [];

    return fundingHistories.map((fundingHistory) => {
      return {
        fund: ModelConverter.funding(fundingHistory),
        present: ModelConverter.present(fundingHistory.Present),
      };
    });
  }

  async deleteFunding(
    userId: number,
    presentId: number,
    fundId: number,
  ): Promise<DeleteFundResponse> {
    await this.usersService.findUser('id', userId, null);

    const fund = await this.findFund('id', fundId, ['Sender']);

    // 자신의 펀딩이 아니면 불가능 하게 함
    if (fund.Sender.id !== userId) {
      throw new BadRequestException({
        message: '자신의 펀딩만 취소할 수 있습니다.',
        code: customErrorCode.FUNDING_NOT_MINE,
      });
    }

    const present = await this.presentsService.findPresent('id', presentId, [
      'User',
    ]);

    // 완료된 펀딩은 취소 불가능하게 함
    if (present.complete) {
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
      await this.deleteFund(fundId, queryRunner);

      // present에서 money 차감우
      await this.presentsService.updatePresentMoney(
        present,
        fund.cost,
        'minus',
        queryRunner,
      );

      await queryRunner.manager.getRepository(PresentEntity).save(present);

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
