import { Module } from '@nestjs/common';
import { DailyConsumptionsService } from './daily-consumptions.service';
import { DailyConsumptionsController } from './daily-consumptions.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [],
  controllers: [DailyConsumptionsController],
  providers: [DailyConsumptionsService, PrismaService],
  exports: [DailyConsumptionsService],
})
export class DailyConsumptionsModule { }
