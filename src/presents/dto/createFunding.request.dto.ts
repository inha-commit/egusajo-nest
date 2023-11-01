import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundingRequestDto {
  @ApiProperty({
    description: '펀딩할 금액',
  })
  @IsNumber()
  readonly cost: number;

  @ApiProperty({
    description: '펀딩할때 한마디',
  })
  @IsString()
  readonly comment: string;
}
