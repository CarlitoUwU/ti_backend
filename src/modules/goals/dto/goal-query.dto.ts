import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { MonthEnum } from './month.enum';

export class GoalQueryDto {
  @IsEnum(MonthEnum)
  @ApiProperty({ enum: MonthEnum, description: 'Month name', example: 'June' })
  month!: MonthEnum;

  @IsNumberString()
  @ApiProperty({ description: 'Year', example: 2025 })
  year!: string;
}
