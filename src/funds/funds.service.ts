import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFundingRequestDto } from '../presents/dto/createFunding.request.dto';
import customErrorCode from '../type/custom.error.code';
import { FundingEntity } from '../entities/funding.entity';
import { PresentEntity } from '../entities/present.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../entities/user.entity';
import { CreateFundDAO } from '../type/type';

@Injectable()
export class FundsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PresentEntity)
    private presentRepository: Repository<PresentEntity>,
    @InjectRepository(FundingEntity)
    private fundingRepository: Repository<FundingEntity>,
    private usersService: UsersService,
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

    if (cost <= 0) {
      throw new BadRequestException({
        message: '금액은 최소 0원 이상이어야 합니다!',
        code: customErrorCode.FUNDING_MONEY_SHORT_FALL,
      });
    }

    return await queryRunner.manager.getRepository(FundingEntity).save({
      cost: cost,
      comment: comment,
      Present: present,
      Sender: sender,
      Receiver: receiver,
    });
  }

  async Funding(
    userId: number,
    presentId: number,
    data: CreateFundingRequestDto,
  ) {
    const { cost } = data;

    const user = await this.usersService.findUser('id', userId);

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
      const fund = await this.createFund(
        data,
        present,
        user,
        present.User,
        queryRunner,
      );

      const total_money = present.money + cost;
      let total_complete = present.complete;

      if (total_money >= present.goal) {
        total_complete = true;
      }

      present.money = total_money;
      present.complete = total_complete;

      // TODO: 이 부분 update 코드로 변경
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
}
