import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class UserMedalDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID who earned the medal',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsInt()
  @ApiProperty({
    description: 'Medal ID that was earned',
    example: 1,
  })
  melda_id!: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date when the medal was achieved',
    example: '2025-06-26T00:00:00.000Z',
  })
  achievement_date!: Date;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-medal relationship is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
