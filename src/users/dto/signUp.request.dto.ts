import { IsString, MaxLength } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  readonly snsId: string;

  @IsString()
  @MaxLength(30)
  readonly nickname: string;

  @IsString()
  readonly birthday: string;

  @IsString()
  readonly profileImageSrc: string | null;
}
