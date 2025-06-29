import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { DeviceBaseDto } from '.';

export class ActivateDeviceDto extends DeviceBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the device is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateDeviceDto extends DeviceBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the device is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
