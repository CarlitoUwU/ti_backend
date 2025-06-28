import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateMonthlyConsumptionDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID for whom to calculate monthly consumption',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  user_id!: string
}