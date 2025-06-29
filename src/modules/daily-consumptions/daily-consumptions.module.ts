import { Module } from '@nestjs/common';
import { DailyConsumptionsService } from './daily-consumptions.service';
import { DailyConsumptionsController } from './daily-consumptions.controller';
import { PrismaService } from '../../prisma.service';
import { SavingsModule } from '../savings/savings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SavingsModule, NotificationsModule],
  controllers: [DailyConsumptionsController],
  providers: [DailyConsumptionsService, PrismaService],
  exports: [DailyConsumptionsService],
})
export class DailyConsumptionsModule {}
