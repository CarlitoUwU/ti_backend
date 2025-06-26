import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateMedalDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the medal', example: 'Eco Champion' })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Description of the medal', example: 'Awarded for reducing energy consumption by 20%' })
  description!: string;

  @IsUrl()
  @ApiProperty({ description: 'URL of the medal image', example: 'https://example.com/images/eco-champion.png' })
  url_img!: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the medal is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
