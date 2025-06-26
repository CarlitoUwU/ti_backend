import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

export class UserProfileDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique UUID identifier for the user',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  user_id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  last_name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'List of tastes or preferences',
    example: ['tech', 'sports', 'reading'],
    required: false,
    type: [String],
  })
  tastes?: string[];

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user profile is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
