import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the device', example: 'Microwave' })
  name!: string;

  @IsNumber()
  @ApiProperty({ description: 'Consumption in kilowatt-hour per hour', example: 1.2 })
  consumption_kwh_h!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'URL of the device',
    example: 'https://www.example.com/device/123',
  })
  url!: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the device is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
