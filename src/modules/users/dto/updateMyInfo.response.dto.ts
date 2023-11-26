import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMyInfoResponseDto {
  @ApiProperty({
    name: 'success',
    description: '성공 여부',
  })
  public success: boolean;

  constructor(obj: UpdateMyInfoResponseDto) {
    this.success = obj.success;
  }
}
