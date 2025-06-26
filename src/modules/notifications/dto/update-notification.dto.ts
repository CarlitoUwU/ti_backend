import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
} from 'class-validator';
import { NotificationBaseDto } from '.';

export class ActivateNotificationDto extends (NotificationBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateNotificationDto extends (NotificationBaseDto) {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}
