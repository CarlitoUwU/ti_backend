import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  IsInt,
} from 'class-validator';
import { DistrictDto } from 'src/modules/districts/dto/district.dto';
import { UserProfileBaseDto } from 'src/modules/user_profiles/dto';

export class UserDto {
  @IsUUID()
  @ApiProperty({ description: 'Unique UUID identifier for the user', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

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

  @IsNotEmpty()
  @ApiProperty({ type: () => DistrictDto, description: 'District info' })
  @ApiProperty({ description: 'ID of the district the user belongs to', example: 1 })
  district!: DistrictDto;

  @IsNotEmpty()
  @ApiProperty({type: () => UserProfileBaseDto, description: 'User profile information'})
  user_profile!: UserProfileBaseDto;

  @IsBoolean()
  @ApiProperty({ description: 'Whether the user account is active', example: true, default: true })
  is_active!: boolean;

  @IsDate()
  @ApiProperty({ description: 'Date when the user was created', example: '2025-06-25T00:00:00Z' })
  created_at!: Date;

  @IsDate()
  @ApiProperty({ description: 'Date when the user was last updated', example: '2025-06-25T00:00:00Z' })
  updated_at!: Date;

  @IsDate()
  @ApiProperty({ description: 'Date and time of last login', example: '2025-06-25T00:00:00Z' })
  last_login!: Date;
}
