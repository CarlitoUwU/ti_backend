import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserProfileBaseDto } from "src/modules/user_profiles/dto";
import { DistrictBaseDto } from "src/modules/districts/dto";

export class UserBaseDto {
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
  @ApiProperty({type: DistrictBaseDto, description: 'District info'})
  district!: DistrictBaseDto;

  @IsNotEmpty()
  @ApiProperty({ type: UserProfileBaseDto, description: 'User profile information' })
  user_profile!: UserProfileBaseDto;

  @IsBoolean()
  @ApiProperty({ description: 'Whether the user account is active', example: true, default: true })
  is_active!: boolean;
}
