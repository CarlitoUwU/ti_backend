import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber, IsPositive } from "class-validator";

export class CreateMonthlyConsumptionDto {
  @IsUUID()
  @ApiProperty({
    description: 'User ID for the monthly consumption record',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  user_id!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Total kWh consumed in the month',
    example: 150.75,
    minimum: 0.01
  })
  kwh_total!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Cost per kWh in soles',
    example: 0.62,
    minimum: 0.01
  })
  kwh_cost!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({
    description: 'Total amount paid in soles',
    example: 93.47,
    minimum: 0.01
  })
  amount_paid!: number;
}