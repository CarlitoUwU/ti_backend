import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { GoalBaseDto } from '.';
import { MonthEnum } from './month.enum';

export class ActivateGoalDto extends GoalBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the goal is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateGoalDto extends GoalBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the goal is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}

export class UpdateGoalDto {
  @IsOptional()
  @IsEnum(MonthEnum)
  @ApiProperty({
    description: 'Month for the goal',
    enum: MonthEnum,
    example: MonthEnum.July,
    required: false,
  })
  month?: MonthEnum;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'Year for the goal', example: 2025, required: false })
  year?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Goal consumption in kilowatt-hours',
    example: 175.0,
    required: false,
  })
  goal_kwh?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the goal is active',
    example: true,
    required: false,
  })
  is_active?: boolean;
}
