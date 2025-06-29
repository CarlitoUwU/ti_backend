import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateMonthlyConsumptionDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Total kWh consumed in the month',
    example: 150.75,
    minimum: 0.01,
    required: false,
  })
  kwh_total?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Cost per kWh in soles',
    example: 0.62,
    minimum: 0.01,
    required: false,
  })
  kwh_cost?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Total amount paid in soles',
    example: 93.47,
    minimum: 0.01,
    required: false,
  })
  amount_paid?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the monthly consumption record is active',
    example: true,
    required: false,
  })
  is_active?: boolean;
}