import { IsString } from 'class-validator';

export class NicknameValidationDto {
  @IsString()
  readonly nickname: string;
}
