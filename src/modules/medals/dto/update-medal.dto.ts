import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
} from 'class-validator';
import { MedalBaseDto } from '.';

export class ActivateMedalDto extends (MedalBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the medal is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateMedalDto extends (MedalBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the medal is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
