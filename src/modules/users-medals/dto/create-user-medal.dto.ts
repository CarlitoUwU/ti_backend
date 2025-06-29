import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateUserMedalDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID who earned the medal',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsInt()
  @ApiProperty({ description: 'Medal ID that was earned', example: 1 })
  melda_id!: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-medal relationship is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
