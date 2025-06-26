import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
} from 'class-validator';
import { DistrictBaseDto } from '.';

export class ActivateDistrictDto extends (DistrictBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the district is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateDistrictDto extends (DistrictBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the district is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
