import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { DistrictsModule } from '../modules/districts/districts.module';
import { DevicesModule } from '../modules/devices/devices.module';

@Module({
  imports: [UsersModule, DistrictsModule, DevicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
