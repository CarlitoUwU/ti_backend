import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AutomaticNotificationsService } from './automatic-notifications.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, AutomaticNotificationsService, PrismaService],
  exports: [NotificationsService, AutomaticNotificationsService],
})
export class NotificationsModule { }
