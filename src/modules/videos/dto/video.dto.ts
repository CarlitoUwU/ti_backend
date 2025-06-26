import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class VideoDto {
  @IsInt()
  @ApiProperty({
    description: 'Unique identifier of the video',
    example: 1,
  })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Title of the video',
    example: 'How to Save Energy at Home',
  })
  title!: string;

  @IsUrl()
  @ApiProperty({
    description: 'URL of the video',
    example: 'https://www.youtube.com/watch?v=example',
  })
  url!: string;

  @IsNumber()
  @ApiProperty({
    description: 'Duration of the video in seconds',
    example: 180,
  })
  duration_seg!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the video is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
