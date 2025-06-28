import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateGoalDto {
  @IsUUID()
  @ApiProperty({ description: 'User ID who will own the goal', example: '550e8400-e29b-41d4-a716-446655440001' })
  user_id!: string;

  @IsNumber()
  @ApiProperty({ description: 'Estimated cost budget for the goal in soles', example: 63.21 })
  estimated_cost!: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the goal is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
