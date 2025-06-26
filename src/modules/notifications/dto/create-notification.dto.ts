import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @ApiProperty({ description: 'User ID who will receive the notification', example: '550e8400-e29b-41d4-a716-446655440001' })
  user_id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name/Title of the notification', example: 'Monthly Report' })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Description of the notification', example: 'Your monthly energy report is ready to view' })
  description!: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification is active',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean = true;
}
