import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsUUID } from 'class-validator';
import { MonthEnum } from '../../goals/dto/month.enum';

export class MonthlyConsumptionDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the monthly consumption record',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @IsUUID()
  @ApiProperty({
    description: 'User ID who owns the monthly consumption record',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsEnum(MonthEnum)
  @ApiProperty({
    description: 'Month for the consumption record',
    enum: MonthEnum,
    example: MonthEnum.June,
  })
  month!: MonthEnum;

  @IsInt()
  @ApiProperty({
    description: 'Year for the consumption record',
    example: 2025,
  })
  year!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Total kWh consumed in the month (provided by user)',
    example: 156.75,
  })
  kwh_total!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Cost per kWh in soles (provided by user)',
    example: 0.62,
  })
  kwh_cost!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Total amount paid for the month in soles (provided by user)',
    example: 97.19,
  })
  amount_paid!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the monthly consumption record is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
