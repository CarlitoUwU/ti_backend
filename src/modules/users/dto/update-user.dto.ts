import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
} from 'class-validator';
import { UserBaseDto } from '.';

export class ActivateUserDto extends (UserBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateUserDto extends (UserBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
