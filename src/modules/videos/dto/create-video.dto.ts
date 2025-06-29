import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Title of the video', example: 'Energy Saving Tips' })
  title!: string;

  @IsUrl()
  @ApiProperty({
    description: 'URL of the video',
    example: 'https://www.youtube.com/watch?v=example123',
  })
  url!: string;

  @IsNumber()
  @ApiProperty({ description: 'Duration of the video in seconds', example: 240 })
  duration_seg!: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the video is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
