import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { DistrictsModule } from '../modules/districts/districts.module';
import { DevicesModule } from '../modules/devices/devices.module';
import { VideosModule } from '../modules/videos/videos.module';

@Module({
  imports: [UsersModule, DistrictsModule, DevicesModule, VideosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
