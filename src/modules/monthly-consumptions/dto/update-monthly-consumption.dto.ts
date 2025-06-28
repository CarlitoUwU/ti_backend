import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateMonthlyConsumptionDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the monthly consumption record is active',
    example: true,
    required: false,
  })
  is_active?: boolean;
}