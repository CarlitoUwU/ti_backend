import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DistrictDto {
  @IsInt()
  @ApiProperty({
    description: 'Unique identifier of the district',
    example: 1,
  })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the district',
    example: 'Miraflores',
  })
  name!: string;

  @IsNumber()
  @ApiProperty({
    description: 'Cost per kilowatt-hour in the district',
    example: 0.42,
  })
  fee_kwh!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the district is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
