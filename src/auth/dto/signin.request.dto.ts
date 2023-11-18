import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SigninRequestDto {
  @ApiProperty({
    description: '카카오 snsId',
  })
  @Transform((value) => value.toString())
  @IsString()
  readonly snsId: string;

  @ApiProperty({
    description: 'fcmId',
  })
  @IsString()
  readonly fcmId: string;
}
