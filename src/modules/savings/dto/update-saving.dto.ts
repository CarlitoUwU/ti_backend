import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
} from 'class-validator';

export class ActivateSavingDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the saving record is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateSavingDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the saving record is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
