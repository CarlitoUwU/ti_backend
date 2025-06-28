import { Module } from '@nestjs/common';
import { DailyConsumptionsService } from './daily-consumptions.service';
import { DailyConsumptionsController } from './daily-consumptions.controller';
import { PrismaService } from '../../prisma.service';
import { MonthlyConsumptionsModule } from '../monthly-consumptions/monthly-consumptions.module';

@Module({
  imports: [MonthlyConsumptionsModule],
  controllers: [DailyConsumptionsController],
  providers: [DailyConsumptionsService,PrismaService],
  exports: [DailyConsumptionsService],
})
export class DailyConsumptionsModule { }
