import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundingRequestDto {
  @ApiProperty({
    description: '펀딩할 금액',
    example: 10000,
  })
  @IsInt()
  @Min(1000, { message: '펀딩은 1000원 이상 하셔야 합니다!' })
  readonly cost: number;

  @ApiProperty({
    description: '펀딩할때 한마디',
  })
  @IsString({ message: 'comment는 문자열이어야 합니다!' })
  readonly comment: string;
}
