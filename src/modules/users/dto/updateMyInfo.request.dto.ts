import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMyInfoRequestDto {
  @ApiProperty({
    name: 'name',
    description: '사용자 이름',
  })
  @IsString({ message: '이름은 문자열이어야 합니다!' })
  @MaxLength(30, { message: '이름은 30자를 넘을 수 없습니다!' })
  public name: string;

  @ApiProperty({
    name: 'nickname',
    description: '사용자 닉네임',
  })
  @IsString({ message: '닉네임은 문자열이어야 합니다!' })
  @MaxLength(30, { message: '닉네임은 30자를 넘을 수 없습니다!' })
  public nickname: string;

  @ApiProperty({
    name: 'birthday',
    description: 'YYYY/MM/DD 형식으로 보내주세요',
    example: '1998/09/14',
  })
  @IsString({ message: '생일 형식은 문자열이어야 합니다!' })
  public birthday: string;

  // @ApiProperty({
  //   description: '사용자 은행',
  // })
  // @IsString()
  // readonly bank: string;
  //
  // @ApiProperty({
  //   description: '사용자 계좌번호',
  // })
  // @IsString()
  // readonly account: string;

  @ApiProperty({
    name: 'profileImgSsrc',
    description:
      '프로필 이미지 저장소 주소를 보내주세요, 프로필 이미지 설정을 하지 않았다면 서버에서 기본이미지로 설정할테니 null로 보내주세요 ',
  })
  @IsOptional()
  @IsString()
  public profileImgSrc: string | null;

  @ApiProperty({
    name: 'alarm',
    description: '알람 수신 여부',
  })
  @IsBoolean()
  public alarm: boolean;
}
