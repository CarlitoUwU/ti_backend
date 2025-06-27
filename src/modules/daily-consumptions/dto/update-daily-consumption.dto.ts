import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateDailyConsumptionDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date of consumption',
    example: '2025-06-26',
    type: String,
    format: 'date',
    required: false,
  })
  date?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Hours of device usage',
    example: 8.5,
    required: false,
  })
  hours_use?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the daily consumption record is active',
    example: true,
    required: false,
  })
  is_active?: boolean;
}
