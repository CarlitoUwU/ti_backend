import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { MonthEnum } from './month.enum';

export class GoalDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the goal',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @IsUUID()
  @ApiProperty({
    description: 'User ID who owns the goal',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsEnum(MonthEnum)
  @ApiProperty({
    description: 'Month for the goal',
    enum: MonthEnum,
    example: MonthEnum.June,
  })
  month!: MonthEnum;

  @IsInt()
  @ApiProperty({
    description: 'Year for the goal',
    example: 2025,
  })
  year!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Goal consumption in kilowatt-hours',
    example: 150.5,
  })
  goal_kwh!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Estimated cost based on district fee (calculated automatically)',
    example: 63.21,
    readOnly: true,
  })
  estimated_cost!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the goal is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
