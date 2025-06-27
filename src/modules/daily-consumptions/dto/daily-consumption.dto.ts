import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class DailyConsumptionDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the daily consumption record',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @IsUUID()
  @ApiProperty({
    description: 'User ID who owns the consumption record',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsUUID()
  @ApiProperty({
    description: 'Device ID used for consumption',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  device_id!: string;

  @IsDateString()
  @ApiProperty({
    description: 'Date of consumption',
    example: '2025-06-26',
    type: String,
    format: 'date',
  })
  date!: string;

  @IsNumber()
  @ApiProperty({
    description: 'Hours of device usage',
    example: 8.5,
  })
  hours_use!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Estimated consumption in kWh (calculated automatically)',
    example: 12.75,
    readOnly: true,
  })
  estimated_consumption!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the daily consumption record is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
