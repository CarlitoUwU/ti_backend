import { Module } from '@nestjs/common';
import { MonthlyConsumptionsService } from './monthly-consumptions.service';
import { MonthlyConsumptionsController } from './monthly-consumptions.controller';
import { PrismaService } from '../../prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [MonthlyConsumptionsController],
  providers: [MonthlyConsumptionsService, PrismaService],
  exports: [MonthlyConsumptionsService],
})
export class MonthlyConsumptionsModule { }
