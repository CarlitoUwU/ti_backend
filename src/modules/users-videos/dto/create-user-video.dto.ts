import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateUserVideoDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID who watched the video',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsInt()
  @ApiProperty({ description: 'Video ID that was watched', example: 1 })
  video_id!: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-video relationship is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
