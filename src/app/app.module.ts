import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { DistrictsModule } from '../modules/districts/districts.module';
import { DevicesModule } from '../modules/devices/devices.module';
import { VideosModule } from '../modules/videos/videos.module';
import { MedalsModule } from '../modules/medals/medals.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';

@Module({
  imports: [UsersModule, DistrictsModule, DevicesModule, VideosModule, MedalsModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
