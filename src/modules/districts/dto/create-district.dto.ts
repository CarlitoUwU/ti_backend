import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the district', example: 'San Isidro' })
  name!: string;

  @IsNumber()
  @ApiProperty({ description: 'Cost per kilowatt-hour', example: 0.35 })
  fee_kwh!: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the district is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
