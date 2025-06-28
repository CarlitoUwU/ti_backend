import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { MonthEnum } from '../../goals/dto/month.enum';

export class SavingDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the saving record',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @IsUUID()
  @ApiProperty({
    description: 'User ID who owns the saving record',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsEnum(MonthEnum)
  @ApiProperty({
    description: 'Month for the saving calculation',
    enum: MonthEnum,
    example: MonthEnum.June,
  })
  month!: MonthEnum;

  @IsInt()
  @ApiProperty({
    description: 'Year for the saving calculation',
    example: 2025,
  })
  year!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Savings in kWh (calculated automatically based on goal vs actual consumption)',
    example: 25.5,
    readOnly: true,
  })
  savings_kwh!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Savings in soles (calculated automatically based on district fee)',
    example: 127.50,
    readOnly: true,
  })
  savings_sol!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the saving record is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
