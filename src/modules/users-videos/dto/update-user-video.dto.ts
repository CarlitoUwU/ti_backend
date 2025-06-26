import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
} from 'class-validator';
import { UserVideoBaseDto } from '.';

export class ActivateUserVideoDto extends (UserVideoBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-video relationship is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateUserVideoDto extends (UserVideoBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user-video relationship is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
