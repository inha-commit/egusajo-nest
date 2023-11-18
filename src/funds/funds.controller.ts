import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../guard/access.token.guard';
import { FundsService } from './funds.service';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetFundingHistoryReponseDto } from './dto/getFundingHistory.response.dto';
import { CreatePresentResponseDto } from '../presents/dto/createPresent.response.dto';

@ApiTags('funds')
@Controller('funds')
export class FundsController {
  constructor(private fundsService: FundsService) {}

  @ApiOperation({
    summary: '내가 펀딩한 목록들 가져오기',
    description: 'GetFundingHistoryReponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: GetFundingHistoryReponseDto,
  })
  @ApiResponse({
    status: 1002,
    description: '회원가입 되지 않은 유저',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '회원가입 되지 않은 유저입니다!',
          code: 1002,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMyFundingHistory(@Req() request) {
    const fundingHistory = await this.fundsService.getFundingHistory(
      parseInt(request.userId),
    );

    return new GetFundingHistoryReponseDto(fundingHistory);
  }
}
