import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/tasks.service';
import { NotificationsModule } from '../modules/notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationsModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule { }
