import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { UserMedalBaseDto } from '.';

export class ActivateUserMedalDto extends UserMedalBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-medal relationship is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateUserMedalDto extends UserMedalBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-medal relationship is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
