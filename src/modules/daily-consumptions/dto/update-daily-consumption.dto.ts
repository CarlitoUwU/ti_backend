import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateDailyConsumptionDto {
  @IsNumber()
  @ApiProperty({
    description: 'Hours of device usage',
    example: 8.5,
    required: false,
  })
  hours_use!: number;
}
