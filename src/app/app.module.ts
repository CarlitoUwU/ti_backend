import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { DistrictsModule } from '../modules/districts/districts.module';
import { DevicesModule } from '../modules/devices/devices.module';
import { VideosModule } from '../modules/videos/videos.module';
import { MedalsModule } from '../modules/medals/medals.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { UsersVideosModule } from '../modules/users-videos/users-videos.module';
import { UsersMedalsModule } from '../modules/users-medals/users-medals.module';
import { GoalsModule } from '../modules/goals/goals.module';

@Module({
  imports: [UsersModule, DistrictsModule, DevicesModule, VideosModule, MedalsModule, NotificationsModule, UsersVideosModule, UsersMedalsModule, GoalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
