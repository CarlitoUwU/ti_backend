import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { NotificationBaseDto } from '.';

export class ActivateNotificationDto extends NotificationBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification is active',
    example: true,
    default: true,
  })
  is_active: boolean = true;
}

export class DesactivateNotificationDto extends NotificationBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification is active',
    example: false,
    default: false,
  })
  is_active: boolean = false;
}

export class MarkAsReadNotificationDto extends NotificationBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification has been read',
    example: true,
    default: true,
  })
  was_read: boolean = true;
}

export class MarkAsUnreadNotificationDto extends NotificationBaseDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
    default: false,
  })
  was_read: boolean = false;
}
