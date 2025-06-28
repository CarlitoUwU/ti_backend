import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class DeviceDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the device',
    example: 'Refrigerator',
  })
  name!: string;

  @IsNumber()
  @ApiProperty({
    description: 'Consumption in kilowatt-hour per hour',
    example: 0.15,
  })
  consumption_kwh_h!: number;

  @IsUrl()
  @ApiProperty({
    description: 'URL of the device',
    example: 'https://www.example.com/device/123',
  })
  url!: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the device is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
