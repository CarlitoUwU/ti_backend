import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class NotificationDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the notification',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @IsUUID()
  @ApiProperty({
    description: 'User ID who owns the notification',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  user_id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name/Title of the notification',
    example: 'Energy Consumption Alert',
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Description of the notification',
    example: 'Your energy consumption has exceeded the monthly goal by 15%',
  })
  description!: string;

  @IsDateString()
  @ApiProperty({
    description: 'Date when the notification was created',
    example: '2025-06-26T00:00:00.000Z',
  })
  created_at!: Date;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification has been read by the user',
    example: false,
    default: false,
  })
  was_read!: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification is active',
    example: true,
    default: true,
  })
  is_active!: boolean;
}
