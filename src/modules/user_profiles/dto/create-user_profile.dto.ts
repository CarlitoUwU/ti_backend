
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateUserProfileDto {
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