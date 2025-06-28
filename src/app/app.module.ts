import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '../common/common.module';
import configuration from '../common/config/configuration';
import { UsersModule } from '../modules/users/users.module';
import { DistrictsModule } from '../modules/districts/districts.module';
import { DevicesModule } from '../modules/devices/devices.module';
import { VideosModule } from '../modules/videos/videos.module';
import { MedalsModule } from '../modules/medals/medals.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { UsersVideosModule } from '../modules/users-videos/users-videos.module';
import { UsersMedalsModule } from '../modules/users-medals/users-medals.module';
import { GoalsModule } from '../modules/goals/goals.module';
import { DailyConsumptionsModule } from '../modules/daily-consumptions/daily-consumptions.module';
import { SavingsModule } from '../modules/savings/savings.module';
import { MonthlyConsumptionsModule } from '../modules/monthly-consumptions/monthly-consumptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CommonModule,
    UsersModule,
    DistrictsModule,
    DevicesModule,
    VideosModule,
    MedalsModule,
    NotificationsModule,
    UsersVideosModule,
    UsersMedalsModule,
    GoalsModule,
    DailyConsumptionsModule,
    SavingsModule,
    MonthlyConsumptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
