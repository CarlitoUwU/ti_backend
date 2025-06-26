import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class UserVideoDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID who watched the video',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsInt()
  @ApiProperty({
    description: 'Video ID that was watched',
    example: 1,
  })
  video_id!: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date when the video was seen',
    example: '2025-06-26T00:00:00.000Z',
  })
  date_seen!: Date;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-video relationship is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
