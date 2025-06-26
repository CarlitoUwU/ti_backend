import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class MedalDto {
  @IsInt()
  @ApiProperty({
    description: 'Unique identifier of the medal',
    example: 1,
  })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the medal',
    example: 'Energy Saver',
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Description of the medal',
    example: 'Awarded for saving 10% energy in a month',
  })
  description!: string;

  @IsUrl()
  @ApiProperty({
    description: 'URL of the medal image',
    example: 'https://example.com/images/energy-saver-medal.png',
  })
  url_img!: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the medal is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
