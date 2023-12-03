import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SigninRequestDto {
  @ApiProperty({
    description: '카카오 snsId',
  })
  @Transform((value) => value.toString())
  @IsString({ message: 'snsId는 문자열이여야 합니다!' })
  readonly snsId: string;

  @ApiProperty({
    description: 'fcmId',
  })
  @IsString({ message: 'fcmId는 문자열이여야 합니다!' })
  readonly fcmId: string;
}
