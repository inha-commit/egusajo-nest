import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePresentRequestDto {
  @ApiProperty({
    description: '선물 이름',
  })
  @IsString({ message: '선물 이름은 문자열이어야 합니다!' })
  readonly name: string;

  @ApiProperty({
    description: '선물 링크가 있다면 보내주세요',
  })
  @IsString({ message: '선물 링크는 문자열이어야 합니다!' })
  readonly productLink: string;

  @ApiProperty({
    description: '목표 금액',
    example: 10000,
  })
  @IsInt()
  @Min(1000, { message: '목표금액은 1000원 이상 설장 하셔야 합니다!' })
  readonly goal: number;

  @ApiProperty({
    description: '목표 날짜 YYYY/MM/DD 형식으로 보내주세요',
    example: '1998/09/14',
  })
  @IsString({ message: '날짜 형식은 문자열이어야 합니다!' })
  readonly deadline: string;

  @ApiProperty({
    description:
      '이미지 저장소 주소를 보내주세요. 이미지는 최소 1개 이상 5개 이하로 보내주세요',
  })
  @IsArray()
  @ArrayMinSize(1, { message: '최소 1개 이상의 이미지가 필요합니다' })
  @ArrayMaxSize(5, { message: '최대 5개 이하의 이미지만 허용됩니다' })
  @IsString({ each: true, message: '각 이미지는 문자열이어야 합니다' })
  readonly presentImages: string[];

  @ApiProperty({
    description: 'presentImages중 하나를 대표 이미지로 보내주세요',
  })
  @IsString({ message: 'representImage 형식은 문자열이어야 합니다!' })
  readonly representImage: string;

  @ApiProperty({
    description: '선물 게시글 제목',
  })
  @IsString({ message: '게시글 제목은 문자열이어야 합니다!' })
  readonly shortComment: string;

  @ApiProperty({
    description: '선물 게시글 내용',
  })
  @IsString({ message: '게시글 내용은 문자열이어야 합니다!' })
  readonly longComment: string;
}
