import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  readonly snsId: string;
}
