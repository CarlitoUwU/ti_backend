import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  MinLength,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email address of the user', example: 'example@gmail.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Unique username of the user', example: 'johndoe' })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Password for the user', example: 'password123' })
  password!: string;

  @IsInt()
  @ApiProperty({ description: 'ID of the district the user belongs to', example: 1 })
  district_id!: number;

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
  taste?: string[];

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user profile is active',
    example: true,
    default: true,
  })
  is_active?: boolean;
}
